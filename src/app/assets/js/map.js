// Google Maps初期化関数
let map;
let markers = [];
let directionsService;
let directionsRenderer;

// Google Maps APIを読み込んだ後に呼び出す
function initMap() {
  // 奄美大島の中心座標
  const amamiCenter = { lat: 28.3764, lng: 129.4957 };
  
  // 地図の作成
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: amamiCenter,
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true
  });

  // Directions Service/Rendererの初期化
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
    suppressMarkers: false
  });

  // 日程からマーカーを配置
  placeScheduleMarkers();
  
  // 経路検索の初期化
  initRouteSearch();

  // グローバルに公開
  window.map = map;
}

// 日程項目からマーカーを配置
function placeScheduleMarkers() {
  if (!map) return;
  
  // 既存のマーカーを削除
  markers.forEach(marker => marker.setMap(null));
  markers = [];

  scheduleData.schedule.forEach(day => {
    day.items.forEach(item => {
      if (item.location && item.location.lat && item.location.lng) {
        const marker = new google.maps.Marker({
          position: { lat: item.location.lat, lng: item.location.lng },
          map: map,
          title: item.activity,
          label: item.time.replace(':', '') // 時刻をラベルに
        });

        // 色分け
        const iconColor = getMarkerColor(item.type);
        if (iconColor) {
          marker.setIcon({
            url: `http://maps.google.com/mapfiles/ms/icons/${iconColor}-dot.png`
          });
        }

        // 情報ウィンドウ
        const infoWindow = new google.maps.InfoWindow({
          content: createInfoWindowContent(item)
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        markers.push(marker);
      }
    });
  });
}

// マーカーの色を決定
function getMarkerColor(type) {
  const colorMap = {
    'sightseeing': 'blue',
    'restaurant': 'red',
    'hotel': 'green',
    'activity': 'yellow'
  };
  return colorMap[type] || null;
}

// 情報ウィンドウのコンテンツを作成
function createInfoWindowContent(item) {
  let content = `<div style="min-width: 200px;">`;
  content += `<strong>${item.time}</strong><br>`;
  content += `<div>${item.activity.replace(/<br>/g, ' ')}</div>`;
  
  if (item.location && item.location.name) {
    content += `<div style="margin-top: 8px; color: #666;">📍 ${item.location.name}</div>`;
  }
  
  if (item.website) {
    content += `<div style="margin-top: 4px;">`;
    content += `<a href="${item.website}" target="_blank" rel="noopener noreferrer">`;
    content += `🔗 ウェブサイト <span class="external-link-icon">↗</span></a>`;
    content += `</div>`;
  } else {
    const query = encodeURIComponent((item.location && item.location.name) ? item.location.name : item.activity);
    const searchUrl = `https://www.google.com/search?q=${query}`;
    content += `<div style="margin-top: 4px;">`;
    content += `<a href="${searchUrl}" target="_blank" rel="noopener noreferrer">`;
    content += `🔎 検索 <span class="external-link-icon">↗</span></a>`;
    content += `</div>`;
  }
  
  content += `</div>`;
  return content;
}

// 経路検索機能の初期化
function initRouteSearch() {
  const fromSelect = document.getElementById('route-from');
  const toSelect = document.getElementById('route-to');
  const searchBtn = document.getElementById('route-search');
  const clearBtn = document.getElementById('route-clear');
  const transportMode = document.querySelectorAll('input[name="transport-mode"]');

  // ドロップダウンに日程項目を追加
  if (fromSelect && toSelect) {
    // 現在地オプションを追加
    fromSelect.add(new Option('現在地（端末の位置）', '__CURRENT__'));

    scheduleData.schedule.forEach(day => {
      day.items.forEach(item => {
        if (item.location && item.location.name) {
          const option = new Option(`${item.time} ${item.location.name}`, item.id);
          fromSelect.add(option.cloneNode(true));
          toSelect.add(option);
        }
      });
    });
  }

  // 検索ボタン
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const fromId = fromSelect.value;
      const toId = toSelect.value;
      
      if (!fromId || !toId) {
        alert('出発地点と到着地点を選択してください。');
        return;
      }

      const toItem = findItemById(toId);

      // Toのバリデーション
      if (!toItem || !toItem.location) {
        alert('到着地点が不正です。');
        return;
      }

      // Fromが現在地の場合
      if (fromId === '__CURRENT__') {
        getUserLocation().then(currentLoc => {
          calculateAndDisplayRoute(currentLoc, toItem.location);
        }).catch(err => {
          alert('現在地を取得できませんでした。ブラウザの位置情報設定を確認してください。');
          console.error('Geolocation error:', err);
        });
        return;
      }

      // 通常のFrom（スケジュール項目）
      const fromItem = findItemById(fromId);
      if (fromItem && fromItem.location) {
        calculateAndDisplayRoute(fromItem.location, toItem.location);
      } else {
        alert('出発地点が不正です。');
      }
    });
  }

  // クリアボタン
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (directionsRenderer) {
        directionsRenderer.setDirections({ routes: [] });
      }
      const routeInfo = document.getElementById('route-info');
      if (routeInfo) {
        routeInfo.classList.remove('show');
      }
    });
  }

  // From/To選択時の地図移動
  if (fromSelect) {
    fromSelect.addEventListener('change', () => {
      const val = fromSelect.value;
      if (val === '__CURRENT__') {
        getUserLocation().then(loc => {
          map.setCenter({ lat: loc.lat, lng: loc.lng });
          map.setZoom(15);
        }).catch(() => {});
        return;
      }
      const item = findItemById(val);
      if (item && item.location) {
        map.setCenter({ lat: item.location.lat, lng: item.location.lng });
        map.setZoom(15);
      }
    });
  }

  if (toSelect) {
    toSelect.addEventListener('change', () => {
      const item = findItemById(toSelect.value);
      if (item && item.location) {
        map.setCenter({ lat: item.location.lat, lng: item.location.lng });
        map.setZoom(15);
      }
    });
  }
}

// IDでアイテムを検索
function findItemById(id) {
  for (const day of scheduleData.schedule) {
    const item = day.items.find(item => item.id === id);
    if (item) return item;
  }
  return null;
}

// 経路を計算して表示
function calculateAndDisplayRoute(fromLocation, toLocation) {
  if (!directionsService || !directionsRenderer) return;

  const selectedMode = document.querySelector('input[name="transport-mode"]:checked');
  const mode = selectedMode ? selectedMode.value : 'DRIVING';

  directionsService.route(
    {
      origin: { lat: fromLocation.lat, lng: fromLocation.lng },
      destination: { lat: toLocation.lat, lng: toLocation.lng },
      travelMode: google.maps.TravelMode[mode]
    },
    (response, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);
        
        // 経路情報を表示
        const route = response.routes[0];
        const leg = route.legs[0];
        
        displayRouteInfo(
          leg.distance.text,
          leg.duration.text,
          mode,
          fromLocation,
          toLocation
        );
      } else {
        alert('経路が見つかりませんでした。');
      }
    }
  );
}

// 現在地をPromiseで取得
function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      position => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      error => reject(error),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

// 経路情報を表示
function displayRouteInfo(distance, duration, mode, fromLocation, toLocation) {
  const routeInfo = document.getElementById('route-info');
  if (!routeInfo) return;

  const modeText = {
    'DRIVING': '車',
    'WALKING': '徒歩',
    'TRANSIT': '公共交通機関'
  };

  // Google Mapsアプリへのリンクを生成
  const fromLat = fromLocation.lat;
  const fromLng = fromLocation.lng;
  const toLat = toLocation.lat;
  const toLng = toLocation.lng;
  const travelMode = mode.toLowerCase();
  
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${fromLat},${fromLng}&destination=${toLat},${toLng}&travelmode=${travelMode}`;

  routeInfo.innerHTML = `
    <div style="padding: 8px;">
      <strong>📍 経路情報</strong><br>
      <div style="margin-top: 8px;">
        <strong>距離:</strong> ${distance}<br>
        <strong>所要時間:</strong> ${duration}（${modeText[mode] || mode}）
      </div>
      <div style="margin-top: 8px;">
        <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" style="color: #0066cc; text-decoration: none;">
          🗺️ Google Mapsアプリで開く <span style="font-size: 0.9em;">↗</span>
        </a>
      </div>
    </div>
  `;
  routeInfo.classList.add('show');
  
  // 経路情報パネルにスクロール（モバイル対応）
  routeInfo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 地図で特定の地点を表示（日程項目から呼び出し）
function showLocationOnMap(itemId) {
  const item = findItemById(itemId);
  if (item && item.location && map) {
    map.setCenter({ lat: item.location.lat, lng: item.location.lng });
    map.setZoom(15);
    
    // 該当セクションにスクロール
    const mapSection = document.getElementById('map-section');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

// グローバルに公開
window.showLocationOnMap = showLocationOnMap;
window.findItemById = findItemById;
window.markers = markers;
