-- TODOリストテーブルの作成
-- このSQLをSupabaseダッシュボードのSQLエディタで実行してください

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
