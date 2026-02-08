# TODOリストアプリ

React + TypeScript + Vite + Supabase で構築されたTODO管理アプリケーションです。

## 機能

- ✅ TODOの追加・編集・削除
- ✅ 完了状態の切り替え
- ✅ フィルタリング（全て・未完了・完了済み）
- ✅ 期限日の設定
- ✅ Supabaseによるデータ永続化

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabaseプロジェクトの設定

1. [Supabase](https://app.supabase.com) でアカウントを作成し、新しいプロジェクトを作成します
2. プロジェクトの設定 > API から以下を取得します：
   - Project URL
   - anon/public key

### 3. 環境変数の設定

`.env.example` を `.env` にコピーし、Supabaseの認証情報を設定してください：

```bash
cp .env.example .env
```

`.env` ファイルを開き、以下の値を設定します：

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. データベースマイグレーションの実行（重要！）

**この手順を実行しないと、TODOの保存が失敗します。**

1. [Supabase Dashboard](https://app.supabase.com) にログインし、プロジェクトを選択します
2. 左サイドバーから **SQL Editor** をクリックします
3. **New query** をクリックして新しいクエリを作成します
4. 以下のSQLをコピー＆ペーストして実行します：

```sql
CREATE TABLE IF NOT EXISTS todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text DEFAULT '',
  deadline timestamptz,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view todos"
  ON todos
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert todos"
  ON todos
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update todos"
  ON todos
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete todos"
  ON todos
  FOR DELETE
  USING (true);

CREATE INDEX IF NOT EXISTS idx_todos_deadline ON todos(deadline);
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
```

5. **Run** ボタンをクリックして実行します
6. 成功メッセージが表示されれば完了です

または、Supabase CLIを使用している場合：

```bash
supabase db push
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開いてアプリケーションを確認できます。

## スクリプト

- `npm run dev` - 開発サーバーを起動
- `npm run build` - 本番用ビルド
- `npm run preview` - ビルドしたアプリをプレビュー
- `npm run lint` - ESLintでコードをチェック
- `npm run typecheck` - TypeScriptの型チェック

## 技術スタック

- **React 18** - UIライブラリ
- **TypeScript** - 型安全性
- **Vite** - ビルドツール
- **Supabase** - バックエンド（データベース）
- **Tailwind CSS** - スタイリング
- **Lucide React** - アイコン
