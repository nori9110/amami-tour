// データモデル
const FAMILIES = [
  { id: 'okabe', name: '岡部', members: 2 },
  { id: 'ono', name: '小野', members: 2 },
  { id: 'imai', name: '今井', members: 2 },
  { id: 'ito', name: '伊藤', members: 2 }
];

// 保存キー
const STORAGE_KEY = 'split-expenses-v1';

// 初期プリセット（ユーザー要件）
function initialExpenses() {
  return [
    {
      id: crypto.randomUUID(), date: '', title: 'ホテルウエストコート 部屋代',
      payer: 'okabe', method: 'perRoom', amount: 12100, rooms: 2, participants: FAMILIES.map(f => f.id),
      checked: true, note: '2部屋×12,100円'
    },
    {
      id: crypto.randomUUID(), date: '', title: 'ホテルウエストコート 朝食',
      payer: 'okabe', method: 'fixedPerPerson', unitPrice: 1320, participants: expandMembersByFamilies(),
      checked: true, note: '全員朝食あり'
    },
    {
      id: crypto.randomUUID(), date: '', title: 'レンタカー',
      payer: 'okabe', method: 'perFamily', amount: 37500, participants: FAMILIES.map(f => f.id),
      checked: true
    },
    {
      id: crypto.randomUUID(), date: '', title: 'ガソリン代',
      payer: 'okabe', method: 'perFamily', amount: 0, participants: FAMILIES.map(f => f.id),
      checked: false
    },
    {
      id: crypto.randomUUID(), date: '', title: 'シュノーケリング ネイティブ奄美',
      payer: 'ito', method: 'fixedPerPerson', unitPrice: 6600, participants: [],
      checked: false
    },
    {
      id: crypto.randomUUID(), date: '', title: 'ホテルカレッタ（朝食付）',
      payer: 'ito', method: 'caretta', amount: 38407, participants: expandMembersByFamilies(),
      checked: true, note: '合計から 4,800円×人数 と余りを表示'
    },
    {
      id: crypto.randomUUID(), date: '', title: 'サンセットクルーズ（現地）',
      payer: 'local', method: 'fixedPerPerson', unitPrice: 5500, participants: [],
      checked: false
    },
    // 他1〜4（自由入力）
    { id: crypto.randomUUID(), date: '', title: '他1', payer: 'local', method: 'fixedPerPerson', unitPrice: 0, participants: [], checked: false },
    { id: crypto.randomUUID(), date: '', title: '他2', payer: 'local', method: 'fixedPerPerson', unitPrice: 0, participants: [], checked: false },
    { id: crypto.randomUUID(), date: '', title: '他3', payer: 'local', method: 'fixedPerPerson', unitPrice: 0, participants: [], checked: false },
    { id: crypto.randomUUID(), date: '', title: '他4', payer: 'local', method: 'fixedPerPerson', unitPrice: 0, participants: [], checked: false }
  ];
}

// 個人IDを家族IDから展開（各家族2名 前提）: okabe-1, okabe-2 ...
function expandMembersByFamilies() {
  const members = [];
  FAMILIES.forEach(f => {
    for (let i = 1; i <= f.members; i++) {
      members.push(`${f.id}-${i}`);
    }
  });
  return members;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { expenses: initialExpenses() };
    const parsed = JSON.parse(raw);
    return { expenses: parsed.expenses || initialExpenses() };
  } catch {
    return { expenses: initialExpenses() };
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();

// 計算ユーティリティ（丸め: 1円単位=そのまま）
function calcPerFamilyShares(expense) {
  const shares = Object.fromEntries(FAMILIES.map(f => [f.id, 0]));
  if (!expense) return shares;

  if (expense.method === 'perRoom') {
    const total = (expense.rooms || 0) * (expense.amount || 0);
    // 2部屋・4人ずつ → 各家族2人なので単純に人数按分 = 各家族同数
    const totalMembers = FAMILIES.reduce((s, f) => s + f.members, 0);
    FAMILIES.forEach(f => {
      shares[f.id] = (total * f.members) / totalMembers;
    });
    return shares;
  }

  if (expense.method === 'fixedPerPerson') {
    const unit = expense.unitPrice || 0;
    const memberSet = new Set(expense.participants || []);
    // 参加者が個人粒度: okabe-1 など
    FAMILIES.forEach(f => {
      let count = 0;
      for (let i = 1; i <= f.members; i++) {
        if (memberSet.has(`${f.id}-${i}`)) count++;
      }
      shares[f.id] = unit * count;
    });
    return shares;
  }

  if (expense.method === 'perFamily') {
    const total = expense.amount || 0;
    const families = (expense.participants || []).filter(Boolean);
    const n = families.length || FAMILIES.length;
    families.forEach(fid => { shares[fid] = total / n; });
    // 参加未指定時は全家族均等
    if (families.length === 0) {
      FAMILIES.forEach(f => { shares[f.id] = total / FAMILIES.length; });
    }
    return shares;
  }

  if (expense.method === 'caretta') {
    // カレッタ: 合計額から 4,800円×人数 と余りを表示
    const total = expense.amount || 0;
    const memberSet = new Set(expense.participants || []);
    const people = memberSet.size || 0;
    const base = 4800 * people;
    const remainder = total - base; // そのまま1円単位
    // 各家族は人数×4,800円を基本負担、余りは伊藤に寄せる or 表示のみ
    // 仕様: 「余りを表示」→ 配分は行わず表示のみ（清算には含めない）
    FAMILIES.forEach(f => {
      let count = 0;
      for (let i = 1; i <= f.members; i++) {
        if (memberSet.has(`${f.id}-${i}`)) count++;
      }
      shares[f.id] = 4800 * count;
    });
    shares.__carettaRemainder = remainder;
    return shares;
  }

  return shares;
}

function calcTotals(expenses) {
  const familyPaid = Object.fromEntries(FAMILIES.map(f => [f.id, 0]));
  const familyOwed = Object.fromEntries(FAMILIES.map(f => [f.id, 0]));
  let carettaRemainder = 0;

  expenses.filter(e => e.checked).forEach(e => {
    const shares = calcPerFamilyShares(e);
    if (shares.__carettaRemainder) carettaRemainder += shares.__carettaRemainder;
    // 立替者の支払（実支出）
    if (familyPaid[e.payer] !== undefined) {
      const amountPaid = e.method === 'fixedPerPerson'
        ? (e.unitPrice || 0) * (e.participants?.length || 0)
        : e.method === 'perRoom'
          ? (e.amount || 0) * (e.rooms || 0)
          : e.method === 'caretta'
            ? (e.amount || 0)
            : (e.amount || 0);
      familyPaid[e.payer] += amountPaid;
    }
    // 各家族の負担（理論負担）
    FAMILIES.forEach(f => { familyOwed[f.id] += shares[f.id] || 0; });
  });

  return { familyPaid, familyOwed, carettaRemainder };
}

// 清算（ネット差額から送金ペア生成）
function computeSettlements(familyPaid, familyOwed) {
  const net = FAMILIES.map(f => ({ id: f.id, name: f.name, amount: familyPaid[f.id] - familyOwed[f.id] }));
  const payers = net.filter(n => n.amount > 0).sort((a, b) => b.amount - a.amount); // 受取側
  const payees = net.filter(n => n.amount < 0).sort((a, b) => a.amount - b.amount); // 支払側（負）
  const settlements = [];
  let i = 0, j = 0;
  while (i < payers.length && j < payees.length) {
    const recv = payers[i];
    const send = payees[j];
    const amount = Math.min(recv.amount, -send.amount);
    if (amount > 0) {
      settlements.push({ from: send.name, to: recv.name, amount });
      recv.amount -= amount;
      send.amount += amount; // send.amount は負なので増加でゼロへ
    }
    if (Math.abs(recv.amount) < 0.5) i++;
    if (Math.abs(send.amount) < 0.5) j++;
  }
  return settlements;
}

// レンダリング
function renderFamilies() {
  const wrap = document.getElementById('families');
  if (!wrap) return;
  wrap.innerHTML = '';
  FAMILIES.forEach(f => {
    const card = document.createElement('div');
    card.className = 'role-card';
    card.innerHTML = `<div class="role-title">${f.name} 家</div><div>人数: ${f.members}人（固定）</div>`;
    wrap.appendChild(card);
  });
}

function renderExpenses() {
  const list = document.getElementById('expense-list');
  list.innerHTML = '';
  state.expenses.forEach(e => {
    const container = document.createElement('div');
    container.className = 'card';
    container.style.marginBottom = '8px';
    const payerOptions = [
      { id: 'okabe', label: '岡部' },
      { id: 'ono', label: '小野' },
      { id: 'imai', label: '今井' },
      { id: 'ito', label: '伊藤' },
      { id: 'local', label: '現地' }
    ];
    const methodOptions = [
      { id: 'fixedPerPerson', label: '固定単価×人数' },
      { id: 'perFamily', label: '家族均等' },
      { id: 'perRoom', label: '部屋按分' },
      { id: 'caretta', label: 'カレッタ特別' }
    ];

    const shares = calcPerFamilyShares(e);
    const familyShareText = FAMILIES.map(f => `${f.name}:${(shares[f.id]||0).toFixed(0)}円`).join(' / ');
    const carettaRemainText = e.method === 'caretta' ? `（余り: ${(shares.__carettaRemainder||0).toFixed(0)}円 表示のみ）` : '';

    container.innerHTML = `
      <label style="display:flex; align-items:center; gap:8px;">
        <input type="checkbox" ${e.checked ? 'checked' : ''} data-action="toggle" data-id="${e.id}">
        <strong>${e.title}</strong>
      </label>
      <div style="margin-top:6px; display:grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap:8px;">
        <div>
          <small>立替者</small>
          <select data-action="payer" data-id="${e.id}" style="width:100%">${payerOptions.map(p => `<option value="${p.id}" ${p.id===e.payer?'selected':''}>${p.label}</option>`).join('')}</select>
        </div>
        <div>
          <small>方式</small>
          <select data-action="method" data-id="${e.id}" style="width:100%">${methodOptions.map(m => `<option value="${m.id}" ${m.id===e.method?'selected':''}>${m.label}</option>`).join('')}</select>
        </div>
        <div>
          <small>金額/単価</small>
          <input type="number" data-action="amount" data-id="${e.id}" value="${e.amount ?? e.unitPrice ?? 0}" style="width:100%">
        </div>
        <div>
          <small>部屋数</small>
          <input type="number" data-action="rooms" data-id="${e.id}" value="${e.rooms ?? ''}" style="width:100%">
        </div>
      </div>
      <div style="margin-top:6px">
        <small>参加（家族/個人切替可）</small>
        <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:4px;">
          ${FAMILIES.map(f => {
            const members = Array.from({ length: f.members }, (_, i) => `${f.id}-${i+1}`);
            const famChecked = (e.participants||[]).some(pid => pid.startsWith(`${f.id}-`)) || (e.participants||[]).includes(f.id);
            return `
              <div class="chip" style="padding:6px 8px; border:1px solid #ccc; border-radius:8px;">
                <label><input type="checkbox" data-action="toggle-family" data-id="${e.id}" data-family="${f.id}" ${famChecked?'checked':''}> ${f.name} 家</label>
                <div style="margin-top:4px; display:flex; gap:6px;">
                  ${members.map(m => `<label style=\"font-size:12px\"><input type=\"checkbox\" data-action=\"toggle-member\" data-id=\"${e.id}\" data-member=\"${m}\" ${(e.participants||[]).includes(m)?'checked':''}> ${m.split('-')[1]}</label>`).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      <div style="margin-top:6px; color:#2e7d32">
        <small>配分結果</small><br>
        <strong>${familyShareText}</strong> ${carettaRemainText}
      </div>
    `;

    list.appendChild(container);
  });

  // イベント委譲
  list.onchange = (ev) => {
    const t = ev.target;
    const id = t.getAttribute('data-id');
    if (!id) return;
    const e = state.expenses.find(x => x.id === id);
    if (!e) return;
    const action = t.getAttribute('data-action');
    if (action === 'toggle') { e.checked = t.checked; }
    if (action === 'payer') { e.payer = t.value; }
    if (action === 'method') { e.method = t.value; }
    if (action === 'amount') {
      if (e.method === 'fixedPerPerson') e.unitPrice = Number(t.value || 0);
      else e.amount = Number(t.value || 0);
    }
    if (action === 'rooms') { e.rooms = Number(t.value || 0); }
    if (action === 'toggle-family') {
      const fam = t.getAttribute('data-family');
      const members = Array.from({ length: FAMILIES.find(f => f.id===fam).members }, (_, i) => `${fam}-${i+1}`);
      const set = new Set(e.participants || []);
      if (t.checked) members.forEach(m => set.add(m)); else members.forEach(m => set.delete(m));
      e.participants = Array.from(set);
    }
    if (action === 'toggle-member') {
      const m = t.getAttribute('data-member');
      const set = new Set(e.participants || []);
      if (t.checked) set.add(m); else set.delete(m);
      e.participants = Array.from(set);
    }
    saveState(state);
    render();
  };
}

function renderTotalsAndSettlements() {
  const { familyPaid, familyOwed, carettaRemainder } = calcTotals(state.expenses);
  const totalsEl = document.getElementById('totals');
  totalsEl.innerHTML = '';
  const line = document.createElement('div');
  line.innerHTML = FAMILIES.map(f => `<strong>${f.name}</strong> 支払: ${familyPaid[f.id].toFixed(0)}円 / 負担: ${familyOwed[f.id].toFixed(0)}円`).join('<br>');
  totalsEl.appendChild(line);

  if (Math.abs(carettaRemainder) > 0.5) {
    const rem = document.createElement('div');
    rem.style.marginTop = '6px';
    rem.style.color = '#6a1b9a';
    rem.textContent = `カレッタ余り: ${carettaRemainder.toFixed(0)}円（表示のみ・配分しません）`;
    totalsEl.appendChild(rem);
  }

  const settlements = computeSettlements(familyPaid, familyOwed);
  const settleEl = document.getElementById('settlements');
  settleEl.innerHTML = '';
  if (settlements.length === 0) {
    settleEl.textContent = '差額なし';
  } else {
    settlements.forEach(s => {
      const div = document.createElement('div');
      div.textContent = `${s.from} → ${s.to}: ${s.amount.toFixed(0)}円`;
      settleEl.appendChild(div);
    });
  }
}

function addItem() {
  state.expenses.push({
    id: crypto.randomUUID(), date: '', title: '新規項目', payer: 'local', method: 'fixedPerPerson',
    unitPrice: 0, participants: [], checked: false
  });
  saveState(state);
  render();
}

function exportCSV() {
  const header = ['日付','項目','立替者','方式','金額/単価','部屋数','参加者数','チェック','家別:岡部','家別:小野','家別:今井','家別:伊藤'];
  const rows = [header];
  state.expenses.forEach(e => {
    const shares = calcPerFamilyShares(e);
    const amount = e.method === 'fixedPerPerson' ? (e.unitPrice||0) : (e.amount||0);
    rows.push([
      e.date||'', e.title||'', e.payer||'', e.method||'', amount, e.rooms||'', e.participants?.length||0, e.checked?1:0,
      (shares['okabe']||0).toFixed(0), (shares['ono']||0).toFixed(0), (shares['imai']||0).toFixed(0), (shares['ito']||0).toFixed(0)
    ]);
  });
  const csv = rows.map(r => r.map(v => String(v).replaceAll('"','""')).map(v => /[",\n]/.test(v)?`"${v}"`:v).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'expenses.csv'; a.click();
  URL.revokeObjectURL(url);
}

function render() {
  renderFamilies();
  renderExpenses();
  renderTotalsAndSettlements();
}

document.addEventListener('DOMContentLoaded', () => {
  render();
  document.getElementById('add-item')?.addEventListener('click', addItem);
  document.getElementById('save-data')?.addEventListener('click', () => saveState(state));
  document.getElementById('export-csv')?.addEventListener('click', exportCSV);
});


