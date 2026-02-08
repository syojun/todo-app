// Supabase Management APIを使用してテーブルを作成するスクリプト
// 注意: このスクリプトにはサービスロールキーが必要です

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 環境変数の読み込み
const envFile = readFileSync(join(__dirname, '.env'), 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('エラー: VITE_SUPABASE_URLが設定されていません');
  process.exit(1);
}

if (!serviceRoleKey) {
  console.error('エラー: SUPABASE_SERVICE_ROLE_KEYが設定されていません');
  console.error('Supabaseダッシュボード > 設定 > API > service_role key から取得してください');
  console.error('\nまたは、以下の方法でテーブルを作成してください:');
  console.error('1. https://app.supabase.com にログイン');
  console.error('2. プロジェクトを選択');
  console.error('3. SQL Editorを開く');
  console.error('4. setup-database.sqlの内容をコピー＆ペーストして実行');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTable() {
  console.log('データベーステーブルを作成しています...');
  
  const sqlFile = readFileSync(join(__dirname, 'setup-database.sql'), 'utf-8');
  
  // SQLを実行
  const { data, error } = await supabase.rpc('exec_sql', { sql: sqlFile });
  
  if (error) {
    // RPCが存在しない場合、直接SQLを実行する方法を試す
    console.log('RPCメソッドが利用できないため、Supabaseダッシュボードで実行してください');
    console.log('\n手順:');
    console.log('1. https://app.supabase.com にログイン');
    console.log('2. プロジェクトを選択');
    console.log('3. SQL Editorを開く');
    console.log('4. setup-database.sqlの内容をコピー＆ペーストして実行');
    console.error('\nエラー:', error.message);
    process.exit(1);
  }
  
  console.log('テーブルが正常に作成されました！');
}

createTable().catch(console.error);
