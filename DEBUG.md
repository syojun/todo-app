# デバッグ手順

## エラーオブジェクトの詳細を確認する方法

1. **ブラウザの開発者ツールを開く**
   - `F12` または `Cmd + Option + I`（Mac）

2. **コンソールタブを開く**

3. **エラーオブジェクトを展開**
   - 「Error fetching todos: Object」の左側の矢印（▶）をクリック
   - または、「=== Error fetching todos ===」というグループを展開

4. **確認する情報**
   - `Error code:` の値
   - `Error message:` の全文
   - `Error details:` の内容
   - `Full error JSON:` の内容

## ネットワークタブでHTTPリクエストを確認

1. **ネットワークタブを開く**
   - 開発者ツールの「Network」タブをクリック

2. **ページをリロード**
   - `Cmd + R`（Mac）または `F5`（Windows）

3. **Supabaseへのリクエストを探す**
   - フィルターに「supabase」と入力
   - `todos` というリクエストを探す

4. **リクエストの詳細を確認**
   - リクエストをクリック
   - 「Headers」タブを開く
   - 「Request Headers」を確認
   - 非ASCII文字が含まれているヘッダーを探す

## シークレットモードで試す

1. **新しいシークレットウィンドウを開く**
   - `Cmd + Shift + N`（Chrome/Edge Mac）
   - `Ctrl + Shift + N`（Chrome/Edge Windows）

2. **`http://localhost:5173` にアクセス**

3. **動作を確認**

## ブラウザのキャッシュを完全にクリア

1. **Chrome/Edgeの場合**
   - `Cmd + Shift + Delete`（Mac）または `Ctrl + Shift + Delete`（Windows）
   - 「キャッシュされた画像とファイル」を選択
   - 「全期間」を選択
   - 「データを削除」をクリック

2. **Safariの場合**
   - Safari > 環境設定 > プライバシー
   - 「Webサイトのデータを削除」をクリック
