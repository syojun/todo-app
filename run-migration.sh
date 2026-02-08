#!/bin/bash

# Supabase Management APIを使用してテーブルを作成するスクリプト
# 使用方法: SUPABASE_SERVICE_ROLE_KEY=your_service_role_key ./run-migration.sh

set -e

SUPABASE_URL="https://ttuoomryfewtmotaeigf.supabase.co"
PROJECT_REF="ttuoomryfewtmotaeigf"
SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY}"

if [ -z "$SERVICE_ROLE_KEY" ]; then
  echo "エラー: SUPABASE_SERVICE_ROLE_KEY環境変数が設定されていません"
  echo ""
  echo "サービスロールキーを取得する方法:"
  echo "1. https://app.supabase.com にログイン"
  echo "2. プロジェクトを選択"
  echo "3. 設定 > API > service_role key をコピー"
  echo ""
  echo "使用方法:"
  echo "  SUPABASE_SERVICE_ROLE_KEY=your_key ./run-migration.sh"
  echo ""
  echo "または、Supabaseダッシュボードから直接実行してください:"
  echo "1. https://app.supabase.com にログイン"
  echo "2. プロジェクトを選択"
  echo "3. SQL Editorを開く"
  echo "4. setup-database.sqlの内容をコピー＆ペーストして実行"
  exit 1
fi

echo "Supabase Management APIを使用してテーブルを作成しています..."

# SQLファイルを読み込む
SQL=$(cat setup-database.sql)

# Supabase Management APIを使用してSQLを実行
# 注意: このエンドポイントは実際には存在しない可能性があります
# Supabaseは通常、Management API経由でSQLを実行する機能を提供していません

echo "注意: Supabase Management APIは直接SQLを実行する機能を提供していません。"
echo "SupabaseダッシュボードのSQLエディタを使用してください。"
echo ""
echo "実行するSQL:"
echo "────────────────────────────────────────────────────────────"
echo "$SQL"
echo "────────────────────────────────────────────────────────────"
echo ""
echo "手順:"
echo "1. https://app.supabase.com/project/$PROJECT_REF/sql/new を開く"
echo "2. 上記のSQLをコピー＆ペースト"
echo "3. Runボタンをクリック"
