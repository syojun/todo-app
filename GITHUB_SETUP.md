# GitHubセットアップ手順

## 1. GitHubでリポジトリを作成

1. [GitHub](https://github.com) にログイン
2. 右上の「+」ボタンをクリック → 「New repository」を選択
3. リポジトリ名を入力（例: `todo-app`）
4. 「Public」または「Private」を選択
5. 「Initialize this repository with a README」のチェックを**外す**（既にコードがあるため）
6. 「Create repository」をクリック

## 2. ローカルリポジトリをGitHubに接続

GitHubでリポジトリを作成した後、表示される手順に従ってください。通常は以下のようになります：

```bash
cd /Users/takeuchisyojun/Downloads/TO-main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

**注意**: `YOUR_USERNAME` と `YOUR_REPO_NAME` を実際の値に置き換えてください。

## 3. Vercelでデプロイ

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. 「Add New...」→「Project」をクリック
3. GitHubリポジトリを選択（先ほど作成したリポジトリ）
4. プロジェクト設定：
   - Framework Preset: **Vite** を選択
   - Root Directory: `./`（そのまま）
   - Build Command: `npm run build`（自動検出されるはず）
   - Output Directory: `dist`（自動検出されるはず）
5. 「Environment Variables」セクションで以下を追加：
   - `VITE_SUPABASE_URL` = `https://ttuoomryfewtmotaeigf.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `sb_publishable_cZy-mEFHYmbfiw3bawGA9w_N6ebKHyn`
6. 「Deploy」ボタンをクリック

## 4. デプロイ後の確認

デプロイが完了すると、VercelからURLが提供されます（例: `https://your-app.vercel.app`）

このURLを他の人と共有すれば、アプリを使用できます。

## トラブルシューティング

### 環境変数が設定されていない場合

Vercelダッシュボードで：
1. プロジェクトを選択
2. Settings > Environment Variables を開く
3. 環境変数を追加
4. 「Redeploy」をクリック

### ビルドエラーが出る場合

- Vercelのビルドログを確認
- ローカルで `npm run build` を実行してエラーを確認
