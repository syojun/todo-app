-- データベースの状態を確認するSQL
-- このSQLをSupabaseダッシュボードのSQLエディタで実行してください

-- 1. テーブルの存在確認
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'todos'
) AS table_exists;

-- 2. テーブルの構造確認
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'todos'
ORDER BY ordinal_position;

-- 3. RLSの有効化確認
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'todos';

-- 4. ポリシーの確認
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename = 'todos';

-- 5. データの確認（あれば）
SELECT COUNT(*) as todo_count FROM todos;
