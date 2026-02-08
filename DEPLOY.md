# アプリを他の人と共有する方法（Vercelデプロイ）

## 方法1: Vercel CLIを使用（推奨）

### 1. Vercel CLIのインストール

```bash
npm install -g vercel
```

### 2. Vercelにログイン

```bash
vercel login
```

### 3. プロジェクトをデプロイ

```bash
vercel
```

初回デプロイ時は、いくつかの質問に答えます：
- Set up and deploy? → **Y**
- Which scope? → あなたのアカウントを選択
- Link to existing project? → **N**（新規プロジェクトの場合）
- What's your project's name? → プロジェクト名を入力（例: `todo-app`）
- In which directory is your code located? → **./**（そのままEnter）

### 4. 環境変数の設定

デプロイ後、Vercelダッシュボードで環境変数を設定します：

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. プロジェクトを選択
3. Settings > Environment Variables を開く
4. 以下の環境変数を追加：
   - `VITE_SUPABASE_URL` = `https://ttuoomryfewtmotaeigf.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `sb_publishable_cZy-mEFHYmbfiw3bawGA9w_N6ebKHyn`

### 5. 再デプロイ

環境変数を設定した後、再デプロイが必要です：

```bash
vercel --prod
```

または、Vercelダッシュボードから「Redeploy」をクリック

## 方法2: Vercel Web UIを使用

### 1. GitHubにプッシュ（推奨）

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Vercelでインポート

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. 「Add New...」→「Project」をクリック
3. GitHubリポジトリを選択
4. プロジェクトをインポート

### 3. 環境変数の設定

プロジェクト設定で、以下の環境変数を追加：
- `VITE_SUPABASE_URL` = `https://ttuoomryfewtmotaeigf.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `sb_publishable_cZy-mEFHYmbfiw3bawGA9w_N6ebKHyn`

### 4. デプロイ

「Deploy」ボタンをクリック

## デプロイ後の確認

デプロイが完了すると、VercelからURLが提供されます（例: `https://your-app.vercel.app`）

このURLを他の人と共有すれば、アプリを使用できます。

## 注意事項

- `.env`ファイルはGitにコミットしないでください（既に`.gitignore`に含まれています）
- 環境変数はVercelダッシュボードで設定してください
- デプロイ後、環境変数が正しく設定されているか確認してください
