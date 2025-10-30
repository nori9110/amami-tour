// HTML生成用のヘルパー関数
function renderScheduleItems(items) {
  return items.map(item => {
    let html = `
      <div class="checkbox-item">
        <input type="checkbox" id="${item.id}"本方change="updateProgress()">
        <div class="time">${item.time}</div>
        <div class="activity">
          <div class="activity-text">${item.activity}</div>
          ${item.note ? `<small>${item.note}</small>` : ''}
          <div class="activity-links">
            ${item.website ? `<a href="${item.website}" target="_blank" rel="noopener noreferrer">🔗 ${item.location ? item.location.name : 'ウェブサイト'} <span class="external-link-icon">↗</span></a>` : ''}
            ${item.location ? `<a href="#" onclick="showLocationOnMap('${item.id}'); return false;">📍 地図で表示</a>` : ''}
          </div>
        </div>
      </div>
    `;
    return html;
  }).join('');
}
