# データベーステーブルの作成手順

## 方法1: Supabaseダッシュボードから実行（推奨）

1. **Supabaseダッシュボードにアクセス**
   - https://app.supabase.com にログイン
   - プロジェクト `ttuoomryfewtmotaeigf` を選択

2. **SQLエディタを開く**
   - 左サイドバーから「SQL Editor」をクリック
   - 「New query」ボタンをクリック

3. **SQLを実行**
   - 以下のSQLをコピー＆ペースト
   - 「Run」ボタン（または Cmd+Enter）をクリック
   - 成功メッセージが表示されれば完了です

## 実行するSQL

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

-- 既存のポリシーを削除（エラーを避けるため）
DROP POLICY IF EXISTS "Anyone can view todos" ON todos;
DROP POLICY IF EXISTS "Anyone can insert todos" ON todos;
DROP POLICY IF EXISTS "Anyone can update todos" ON todos;
DROP POLICY IF EXISTS "Anyone can delete todos" ON todos;

-- ポリシーの作成
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

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_todos_deadline ON todos(deadline);
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
```

## 方法2: setup-database.sqlファイルを使用

プロジェクトルートの `setup-database.sql` ファイルの内容をSupabaseダッシュボードのSQLエディタにコピー＆ペーストして実行してください。

## 確認方法

テーブルが正常に作成されたか確認するには：

1. Supabaseダッシュボードで「Table Editor」を開く
2. `todos` テーブルが表示されていれば成功です

または、アプリケーションをリロードして、TODOの追加が正常に動作するか確認してください。
