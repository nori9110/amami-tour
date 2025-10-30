# Google Maps APIキー設定ガイド

## 概要

このガイドでは、Google Maps APIキーを取得・設定する手順を初心者向けに詳しく説明します。

**所要時間**: 約15-20分  
**必要なもの**: Googleアカウント、クレジットカード（認証のみ、無料枠あり）

---

## ステップ1: Google Cloud Platform（GCP）アカウントの準備

### 1.1 Googleアカウントにログイン
1. ブラウザで https://cloud.google.com/ にアクセス
2. 右上の「コンソールに移動」または「無料トライアルを開始」をクリック
3. Googleアカウントでログイン（お持ちでない場合は新規作成）

### 1.2 無料トライアルの開始（初めての場合）
1. 「無料トライアルを開始」をクリック
2. **重要**: 無料トライアルでは **$300の無料クレジット** が提供されます
3. クレジットカード情報の入力が必要（認証のみ、自動で課金されません）
4. 国、利用規約に同意、アカウント情報を入力

**注意**: 
- 無料枠は十分にあるため、通常の使用では課金されません
- Google Maps JavaScript APIの無料枠: **月28,000回のリクエスト**
- 自動課金を心配する場合は、利用料金のアラートを設定できます

---

## ステップ2: プロジェクトの作成

### 2.1 新しいプロジェクトを作成
1. Google Cloud Consoleの左上の「プロジェクトを選択」をクリック
2. 「新しいプロジェクト」をクリック
3. プロジェクト名を入力（例: `amami-oshima-tour` または `奄美大島旅行`）
4. 「作成」をクリック
5. プロジェクトが作成されるまで数秒待つ（通知が表示されます）

### 2.2 プロジェクトを選択
1. 作成したプロジェクトを選択状態にする

---

## ステップ3: Google Maps JavaScript APIの有効化

### 3.1 APIライブラリにアクセス
1. 左側のメニューから「APIとサービス」→「ライブラリ」をクリック
2. または、検索バーで「Maps JavaScript API」を検索

### 3.2 Maps JavaScript APIを有効化
1. 「Maps JavaScript API」をクリック
2. 「有効にする」ボタンをクリック
3. 有効化が完了するまで数秒待つ

**補足**: 他のAPIも必要になる可能性があります（フェーズ2で必要に応じて有効化）
- Directions API（経路検索用）
- Geocoding API（住所→座標変換用）

---

## ステップ4: APIキーの作成

### 4.1 認証情報ページに移動
1. 左側のメニューから「APIとサービス」→「認証情報」をクリック
2. または、APIライブラリのページから「認証情報」タブをクリック

### 4.2 APIキーを作成
1. 画面上部の「認証情報を作成」→「APIキー」をクリック
2. APIキーが作成され、ポップアップに表示されます

**重要**: このAPIキーを必ずコピーしてください。後で表示することもできますが、セキュリティ上、今すぐコピーしておくことをお勧めします。

---

## ステップ5: APIキーの制限を設定（セキュリティのため重要）

### 5.1 APIキーの制限を設定
1. 作成したAPIキーの右側の「編集」アイコン（鉛筆マーク）をクリック
2. 「アプリケーションの制限」セクションで「HTTP リファラー（ウェブサイト）」を選択
3. 「ウェブサイトの制限」に以下を追加：
   ```
   http://localhost:*
   http://127.0.0.1:*
   https://*.vercel.app/*
   https://your-domain.com/*
   ```
   （`your-domain.com` は実際のドメインに置き換えてください）

4. 「APIの制限」セクションで「キーを制限」を選択
5. 以下を選択（チェックボックス）：
   - ✅ Maps JavaScript API
   - ✅ Directions API（経路検索を使用する場合）
   - ✅ Geocoding API（住所変換を使用する場合）

6. 「保存」をクリック
7. 変更が反映されるまで **数分かかる場合があります**

**注意**: 
- 制限を設定することで、APIキーが悪用されるリスクを減らせます
- 開発中は `localhost` と `127.0.0.1` を許可してください
- 本番環境では、実際のドメインのみを許可してください

---

## ステップ6: 利用料金のアラート設定（推奨）

### 6.1 予算とアラートの設定
1. 左側のメニューから「請求」→「予算とアラート」をクリック
2. 「予算を作成」をクリック
3. 予算名を入力（例: `Maps API使用量`）
4. 予算額を設定（例: `$10`）
5. 「アラート」を設定：
   - 50%: メール通知
   - 90%: メール通知
   - 100%: メール通知
6. 「作成」をクリック

これにより、予期しない課金を防げます。

---

## ステップ7: アプリケーションにAPIキーを設定

### 7.1 開発環境（ローカル）での設定

#### 方法A: 環境変数ファイルを使用（推奨）

1. `src/app` ディレクトリに `.env.local` ファイルを作成
   ```bash
   cd "/Users/nori/IoT Pro Dropbox/05_Praivate/仲良しT/奄美大島/src/app"
   touch .env.local
   ```

2. `.env.local` ファイルに以下を記述（APIキーを実際の値に置き換える）：
   ```
   GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
   ```

3. **重要**: `.env.local` はGitにコミットしないでください
   - `.gitignore` ファイルに `.env.local` を追加

4. `map.html` ファイルを編集して、APIキーを環境変数から読み込むように変更
   （現時点では直接埋め込みでも動作しますが、本番環境では環境変数を使用します）

#### 方法B: 直接埋め込み（間に合わせ・開発用のみ）

1. `src/app/map.html` ファイルを開く
2. 以下の行を探す：
   ```html
   <script async defer
     src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap&libraries=places">
   </script>
   ```
3. `YOUR_API_KEY` を実際のAPIキーに置き換える：
   ```html
   <script async defer
     src="https://maps.googleapis.com/maps/api/js?key=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX&callback=initMap&libraries=places">
   </script>
   ```

**警告**: 
- この方法は開発用のみに使用してください
- APIキーをGitにコミットすると、セキュリティリスクがあります
- 本番環境では必ず環境変数を使用してください

### 7.2 本番環境（Vercel）での設定（フェーズ4で実施）

1. Vercelのプロジェクト設定に移動
2. 「Settings」→「Environment Variables」をクリック
3. 新しい環境変数を追加：
   - **Name**: `GOOGLE_MAPS_API_KEY`
   - **Value**: 実際のAPIキー
   - **Environment**: Production, Preview, Development 全てを選択
4. 「Save」をクリック

---

## ステップ8: 動作確認

### 8.1 ローカルでの確認
1. ブラウザで `http://localhost:8001/map.html` にアクセス
2. 地図が表示されることを確認
3. コンソール（F12キー）でエラーがないか確認

### 8.2 エラーが出る場合

#### エラー: "This page can't load Google Maps correctly"
- **原因**: APIキーが正しく設定されていない、または制限によりブロックされている
- **解決策**: 
  1. APIキーが正しくコピーされているか確認
  2. 開発環境では `localhost` と `127.0.0.1` が制限に含まれているか確認
  3. APIが有効化されているか確認

#### エラー: "RefererNotAllowedMapError"
- **原因**: HTTPリファラーの制限により、現在のドメインが許可されていない
- **解決策**: APIキーの制限設定に `http://localhost:*` を追加

#### エラー: "ApiNotActivatedMapError"
- **原因**: Maps JavaScript APIが有効化されていない
- **解決策**: Google Cloud ConsoleでAPIを有効化する

---

## 料金について

### 無料枠（毎月）
- **Maps JavaScript API**: 28,000回のリクエストまで無料
- **Directions API**: 月40,000リクエストまで無料
- **Geocoding API**: 月40,000リクエストまで無料

### 無料枠超過時の料金（参考）
- Maps JavaScript API: $7/1,000リクエスト
- Directions API: $5/1,000リクエスト（基本料金）

### 個人利用の場合
- 通常、無料枠で十分な使用量です
- 月に数百回～数千回程度のアクセスなら無料枠内です

---

## セキュリティのベストプラクティス

### ✅ 実施すべきこと
1. **APIキーの制限を設定する**
   - HTTPリファラー制限
   - API制限
2. **環境変数を使用する**
   - `.env.local` をGitにコミットしない
   - 本番環境では環境変数を使用
3. **定期的にAPIキーを確認する**
   - 不正な使用がないか確認
   - 必要に応じてキーを再生成

### ❌ 実施してはいけないこと
1. **APIキーを公開リポジトリにコミットしない**
2. **APIキーをソーシャルメディアで共有しない**
3. **制限のないAPIキーを使用しない**

---

## トラブルシューティング

### Q: APIキーを失くしてしまった
A: Google Cloud Consoleの「認証情報」ページから再表示できます。また、必要に応じて新しいキーを作成できます。

### Q: 無料枠を超えて課金されることはありますか？
A: 無料枠を超えても、自動で課金されることはありません。ただし、予算とアラートを設定することをお勧めします。

### Q: 複数のプロジェクトで同じAPIキーを使えますか？
A: 技術的には可能ですが、セキュリティ上、プロジェクトごとに異なるAPIキーを使用することをお勧めします。

### Q: APIキーを変更する場合、何をすればいいですか？
A: 新しいAPIキーを作成し、アプリケーションの設定を更新してください。古いキーは削除または無効化できます。

---

## チェックリスト

APIキーの設定が完了したら、以下を確認してください：

- [ ] Google Cloud Platformアカウントを作成した
- [ ] 新しいプロジェクトを作成した
- [ ] Maps JavaScript APIを有効化した
- [ ] APIキーを作成した
- [ ] APIキーの制限を設定した（HTTPリファラー、API制限）
- [ ] 利用料金のアラートを設定した（推奨）
- [ ] アプリケーションにAPIキーを設定した
- [ ] ローカルで動作確認した
- [ ] `.env.local` を `.gitignore` に追加した
- [ ] エラーなく地図が表示されることを確認した

---

## 次のステップ

APIキーの設定が完了したら、以下を実施してください：

1. **フェーズ2の実装**: 地図操作機能の実装
2. **動作確認**: 地図表示、マーカー表示、経路検索の動作確認
3. **フェーズ4の準備**: Vercelへのデプロイ時に環境変数を設定

---

## 参考リンク

- [Google Maps Platform 公式ドキュメント](https://developers.google.com/maps/documentation)
- [Maps JavaScript API ガイド](https://developers.google.com/maps/documentation/javascript)
- [APIキーのベストプラクティス](https://developers.google.com/maps/api-security-best-practices)
- [料金情報](https://developers.google.com/maps/billing-and-pricing/pricing)

---

## 注意事項

⚠️ **重要**: 
- APIキーは個人情報として扱い、公開しないでください
- 開発中は `localhost` のみを許可し、本番環境では実際のドメインのみを許可してください
- 定期的にAPIの使用状況を確認し、不正な使用がないかチェックしてください

---

**作成日**: 2024年XX月XX日  
**更新日**: 2024年XX月XX日

## 7.3 本番（Vercel）でのキー読込方式（本リポジトリ実装）

- `api/maps-key.js` が `process.env.GOOGLE_MAPS_API_KEY` を返却します（JSON: `{ key }`）。
- クライアント側（`src/app/map.html`）は `/api/maps-key` をfetchし、取得したキーでGoogle Maps JavaScript APIを動的に読み込みます。
- セキュリティ上、APIキーはクライアントに公開されます。必ずHTTPリファラー制限とAPI制限を有効化してください（vercel.app と本番ドメイン）。

```html
<script>
(function loadMapsApi(){
  fetch('/api/maps-key')
    .then(r=>r.json())
    .then(({key})=>{
      const s=document.createElement('script');
      s.async=true; s.defer=true;
      s.src=`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&callback=initMap&libraries=places&loading=async`;
      document.body.appendChild(s);
    })
    .catch(err=>{
      console.error('Failed to load Google Maps API:', err);
      alert('Google Mapsの読み込みに失敗しました。環境変数設定とリファラー制限をご確認ください。');
    });
})();
</script>
```

### Vercel 環境変数の設定
- Vercel Dashboard → Project → Settings → Environment Variables
  - Name: `GOOGLE_MAPS_API_KEY`
  - Value: 取得したキー
  - Environments: Production / Preview / Development

### ルーティング（vercel.json）
- ルート `/` → `src/app/index.html`
- `/schedule` → `src/app/schedule.html`
- `/map` → `src/app/map.html`

これらは本リポジトリの `vercel.json` に設定済みです。

