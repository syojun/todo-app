/*
  # TODOリストテーブルの作成

  1. 新しいテーブル
    - `todos`
      - `id` (uuid, primary key) - 一意識別子
      - `title` (text) - TODOのタイトル
      - `content` (text) - TODOの詳細内容
      - `deadline` (timestamptz) - 期限日時
      - `completed` (boolean) - 完了状態
      - `created_at` (timestamptz) - 作成日時
      - `updated_at` (timestamptz) - 更新日時

  2. セキュリティ
    - `todos`テーブルでRLSを有効化
    - 全てのユーザーがTODOを閲覧可能なポリシーを追加
    - 全てのユーザーがTODOを挿入可能なポリシーを追加
    - 全てのユーザーがTODOを更新可能なポリシーを追加
    - 全てのユーザーがTODOを削除可能なポリシーを追加
*/

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