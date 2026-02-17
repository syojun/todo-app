-- 重要度カラムを追加するSQL
-- SupabaseダッシュボードのSQL Editorで実行してください

ALTER TABLE todos ADD COLUMN IF NOT EXISTS important boolean DEFAULT false;

-- 重要度のインデックスを追加（パフォーマンス向上のため）
CREATE INDEX IF NOT EXISTS idx_todos_important ON todos(important);

-- 既存のデータに影響を与えないように、デフォルト値はfalse
