# 奄美大島旅行しおりアプリケーション プロトタイプ

## 概要

このプロトタイプは、画面定義書に基づいて作成された奄美大島旅行しおりアプリケーションのプロトタイプです。

## ファイル構成

```
prototype/
├── index.html      # メインのHTMLファイル
├── styles.css      # スタイルシート
├── data.js         # 日程データとツアー内容データ
├── main.js         # メインのJavaScript（進捗管理、テーマ切替等）
├── map.js          # Google Maps関連の機能
└── README.md       # このファイル
```

## 必要な環境

- モダンブラウザ（Chrome、Firefox、Safari、Edgeの最新版）
- Google Maps API キー（地図機能を使用する場合）

## セットアップ方法

### 1. Google Maps API キーの取得

1. [Google Cloud Platform](https://console.cloud.google.com/)にアクセス
2. プロジェクトを作成または選択
3. [Google Maps JavaScript API](https://console.cloud.google.com/apis/library/maps-backend.googleapis.com)を有効化
4. [認証情報](https://console.cloud.google.com/apis/credentials)からAPIキーを作成

### 2. APIキーの設定

`index.html`の最後にある以下の行を編集して、APIキーを設定してください：

```html
<script async defer
  src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap&libraries=places">
</script>
```

`YOUR_API_KEY`を取得したAPIキーに置き換えてください。

**注意**: 本番環境では、APIキーを環境変数などで管理し、直接HTMLに埋め込まないようにしてください。

### 3. 動作確認

#### ローカルサーバーでの実行

1. プロトタイプフォルダに移動：
```bash
cd src/prototype
```

2. 簡易HTTPサーバーを起動：

**Python 3の場合:**
```bash
python3 -m http.server 8000
```

**Python 2の場合:**
```bash
python -m SimpleHTTPServer 8000
```

**Node.js (http-server)の場合:**
```bash
npx http-server -p 8000
```

3. ブラウザでアクセス：
```
http://localhost:8000/index.html
```

**注意**: Google Maps APIを使用するには、`file://`プロトコルではなく`http://`または`https://`プロトコルでアクセスする必要があります。

## 主な機能

### 1. 進捗管理
- 日程項目のチェックボックスで進捗を記録
- 進捗率を自動計算して表示
- ローカルストレージに自動保存

### 2. テーマ切替
- ライトモード/ダークモードの切替
- 設定はローカルストレージに保存

### 3. ナビゲーション
- スティッキーナビゲーションメニュー
- スムーズスクロール

### 4. Google Maps機能
- 奄美大島の地図表示
- 日程項目の場所にマーカーを表示
- FromTo経路検索
- 移動手段の選択（車・徒歩・公共交通機関）

### 5. 外部リンク
- 観光地・食事処のWEBサイトへのリンク表示

## 使用方法

### 日程項目のチェック
1. ツアー日程セクションに移動
2. 各項目のチェックボックスをクリックして完了を記録
3. 進捗状況セクションで全体の進捗を確認

### 地図の使用
1. 地図セクションに移動
2. 経路検索パネルで「From」と「To」を選択
3. 移動手段を選択
4. 「経路検索」ボタンをクリック

### 日程項目から地図へ遷移
- 日程項目の「📍 地図で表示」リンクをクリックすると、地図セクションに遷移し、該当地点を表示します

## ブラウザ対応

- Chrome（最新版）
- Firefox（最新版）
- Safari（最新版）
- Edge（最新版）
- iOS Safari
- Android Chrome

## 既知の制限事項

1. **Google Maps APIキーが必要**: 地図機能を使用するには、有効なAPIキーの設定が必要です
2. **データの共有**: 現在はローカルストレージに保存されるため、デバイス間での共有はできません（将来的にVercel KV等で実装予定）
3. **経路検索**: Google Directions APIの使用には従量課金が発生する可能性があります

## トラブルシューティング

### 地図が表示されない
- Google Maps APIキーが正しく設定されているか確認
- ブラウザのコンソールでエラーメッセージを確認
- `http://`または`https://`プロトコルでアクセスしているか確認（`file://`では動作しません）

### 進捗が保存されない
- ブラウザのローカルストレージが有効になっているか確認
- プライベートブラウジングモードを使用している場合は、通常モードで試してください

### スタイルが正しく表示されない
- ブラウザのキャッシュをクリア
- CSSファイルが正しく読み込まれているか確認

## 次のステップ

本プロトタイプは基本的な機能を実装していますが、以下の機能は今後実装予定です：

1. **進捗の共有機能**: Vercel KVまたはServerless Functionsを使用したリアルタイム共有
2. **データ同期**: 複数デバイス間での進捗同期
3. **オフライン対応**: Service Workerを使用したオフライン機能
4. **認証**: 参加メンバーへのアクセス制限

## ライセンス

このプロトタイプは内部使用を目的としています。

## 更新履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|---------|
| 2024-XX-XX | 1.0.0 | 初版作成 |

---

作成日: 2024年
