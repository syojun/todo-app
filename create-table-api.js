// Supabase Management APIを使用してテーブルを作成するスクリプト
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
const projectRef = supabaseUrl?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

if (!projectRef) {
  console.error('エラー: プロジェクト参照を取得できませんでした');
  process.exit(1);
}

const sqlFile = readFileSync(join(__dirname, 'setup-database.sql'), 'utf-8');
const sql = sqlFile.split('--')[0] + sqlFile.split('--').slice(1).join('--').replace(/^[^\n]*\n/, '');

console.log('Supabase Management APIを使用してテーブルを作成します...');
console.log('\n注意: このスクリプトを実行するには、Supabaseのサービスロールキーが必要です。');
console.log('サービスロールキーは、Supabaseダッシュボード > 設定 > API > service_role key から取得できます。');
console.log('\nまたは、以下の手順でSupabaseダッシュボードから直接実行してください:');
console.log('1. https://app.supabase.com にログイン');
console.log('2. プロジェクトを選択');
console.log('3. 左サイドバーから「SQL Editor」をクリック');
console.log('4. 「New query」をクリック');
console.log('5. setup-database.sqlの内容をコピー＆ペースト');
console.log('6. 「Run」ボタンをクリック');
console.log('\n実行するSQL:');
console.log('─'.repeat(60));
console.log(sql);
console.log('─'.repeat(60));
