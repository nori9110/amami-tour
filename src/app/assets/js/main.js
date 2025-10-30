// 総アイテム数を計算
function getTotalItems() {
  let total = 0;
  scheduleData.schedule.forEach(day => {
    total += day.items.length;
  });
  return total;
}

// 進捗状況を更新
function updateProgress() {
  const totalItems = getTotalItems();
  let completedCount = 0;

  scheduleData.schedule.forEach(day => {
    day.items.forEach(item => {
      const checkbox = document.getElementById(item.id);
      const itemElement = checkbox ? checkbox.closest('.checkbox-item') : null;
      
      if (checkbox && checkbox.checked) {
        completedCount++;
        if (itemElement) {
          itemElement.classList.add('completed');
        }
        item.checked = true;
        localStorage.setItem(item.id, 'true');
      } else {
        if (itemElement) {
          itemElement.classList.remove('completed');
        }
        item.checked = false;
        localStorage.removeItem(item.id);
      }
    });
  });

  const percentage = Math.round((completedCount / totalItems) * 100);
  
  // 進捗表示を更新
  const progressText = document.getElementById('progress-text');
  const progressFill = document.getElementById('progress-fill');
  
  if (progressText) {
    progressText.textContent = `${completedCount}/${totalItems} 完了 (${percentage}%)`;
  }
  
  if (progressFill) {
    progressFill.style.width = `${percentage}%`;
    progressFill.textContent = `${percentage}%`;
  }

  // 全項目完了時の通知
  if (percentage === 100 && !localStorage.getItem('tour-complete')) {
    alert('🎉 全工程達成！おめでとうございます！良い旅の思い出を！');
    localStorage.setItem('tour-complete', 'true');
  }
}

// 保存された進捗を復元
function restoreProgress() {
  scheduleData.schedule.forEach(day => {
    day.items.forEach(item => {
      const checkbox = document.getElementById(item.id);
      if (checkbox) {
        const saved = localStorage.getItem(item.id);
        if (saved === 'true') {
          checkbox.checked = true;
          item.checked = true;
        }
      }
    });
  });
}

// 全ての進捗をリセット
function resetAllProgress() {
  if (confirm('全ての進捗をリセットしますか？')) {
    scheduleData.schedule.forEach(day => {
      day.items.forEach(item => {
        const checkbox = document.getElementById(item.id);
        if (checkbox) {
          checkbox.checked = false;
          item.checked = false;
          localStorage.removeItem(item.id);
        }
      });
    });
    localStorage.removeItem('tour-complete');
    updateProgress();
  }
}

// テーマ切替
function restoreTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

// トップへボタン
function setupToTopButton() {
  const toTopBtn = document.getElementById('to-top');
  if (!toTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      toTopBtn.classList.add('show');
    } else {
      toTopBtn.classList.remove('show');
    }
  });

  toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ページ読み込み時の初期化
window.addEventListener('load', function() {
  restoreTheme();
  restoreProgress();
  updateProgress();
  setupToTopButton();
  
  // テーマ切替ボタン
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }
  
  // 印刷ボタン
  const printBtn = document.getElementById('print-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }
  
  // ナビゲーションリンクのスムーズスクロール
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

// グローバルに公開
window.updateProgress = updateProgress;
window.resetAllProgress = resetAllProgress;
window.toggleTheme = toggleTheme;
