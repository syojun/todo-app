-- RLSポリシーの修正SQL
-- このSQLをSupabaseダッシュボードのSQLエディタで実行してください

-- 既存のポリシーを削除（エラーを避けるため）
DROP POLICY IF EXISTS "Anyone can view todos" ON todos;
DROP POLICY IF EXISTS "Anyone can insert todos" ON todos;
DROP POLICY IF EXISTS "Anyone can update todos" ON todos;
DROP POLICY IF EXISTS "Anyone can delete todos" ON todos;

-- RLSが有効になっているか確認（既に有効な場合は何もしない）
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

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
