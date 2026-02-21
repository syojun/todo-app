import { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import TodoForm from './components/TodoForm';
import TodoList, { FilterButtons } from './components/TodoList';
import { supabase } from './lib/supabase';
import type { Todo } from './types/database';
import { addTodoToGoogleCalendar, addTodoToGoogleCalendarAPI } from './lib/googleCalendar';
import { initializeGoogleAuth, getStoredAccessToken, clearAccessToken, validateAccessToken, checkGoogleAuthConfig } from './lib/googleAuth';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>(undefined);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Google認証状態を確認
  useEffect(() => {
    // デバッグ: 環境変数を確認
    console.log('Google Client ID configured:', !!import.meta.env.VITE_GOOGLE_CLIENT_ID);
    console.log('Google Client ID value:', import.meta.env.VITE_GOOGLE_CLIENT_ID ? `${import.meta.env.VITE_GOOGLE_CLIENT_ID.substring(0, 20)}...` : 'not set');
    
    const checkGoogleAuth = async () => {
      const token = getStoredAccessToken();
      if (token) {
        const isValid = await validateAccessToken(token);
        if (isValid) {
          setIsGoogleAuthenticated(true);
        } else {
          clearAccessToken();
          setIsGoogleAuthenticated(false);
        }
      } else {
        setIsGoogleAuthenticated(false);
      }
    };
    checkGoogleAuth();
  }, []);

  // Google認証を開始
  const handleGoogleAuth = async () => {
    console.log('=== Google認証ボタンがクリックされました ===');
    console.log('Current URL:', window.location.href);
    console.log('Origin:', window.location.origin);
    
    // 設定を確認
    const config = checkGoogleAuthConfig();
    
    if (!config.clientIdConfigured) {
      alert('❌ Google Client IDが設定されていません。\n\nVercelの環境変数に「VITE_GOOGLE_CLIENT_ID」が設定されているか確認してください。');
      return;
    }
    
    setIsAuthenticating(true);
    try {
      console.log('認証処理を開始します...');
      await initializeGoogleAuth();
      console.log('✅ 認証が成功しました');
      setIsGoogleAuthenticated(true);
      alert('✅ Googleカレンダーへの連携が完了しました！\n\nこれで、新しいTODOを追加すると自動的にGoogleカレンダーにイベントが追加されます。');
    } catch (error) {
      console.error('❌ Google認証エラー:', error);
      const errorMessage = error instanceof Error ? error.message : '不明なエラー';
      
      // エラーメッセージに基づいて詳細な説明を追加
      let userMessage = '❌ Google認証に失敗しました\n\n';
      userMessage += `エラー: ${errorMessage}\n\n`;
      
      if (errorMessage.includes('redirect_uri_mismatch')) {
        userMessage += '【解決方法】\n';
        userMessage += 'Google Cloud Consoleで以下を設定してください:\n\n';
        userMessage += '1. 「承認済みのJavaScript生成元」に追加:\n';
        userMessage += `   ${config.currentOrigin}\n\n`;
        userMessage += '2. OAuth 2.0 クライアントIDを確認:\n';
        userMessage += `   ${config.clientId.substring(0, 30)}...\n\n`;
        userMessage += '設定後、数分待ってから再度お試しください。';
      } else if (errorMessage.includes('access_denied')) {
        userMessage += '【解決方法】\n';
        userMessage += 'OAuth同意画面が「テスト」モードの場合、以下を設定してください:\n\n';
        userMessage += '1. Google Cloud Console → OAuth同意画面\n';
        userMessage += '2. 「テストユーザー」セクションに以下を追加:\n';
        userMessage += '   levo.shoon511@gmail.com\n\n';
        userMessage += 'または、公開ステータスを「本番」に変更してください。';
      } else if (errorMessage.includes('Client ID is not configured')) {
        userMessage += '【解決方法】\n';
        userMessage += 'Vercelの環境変数に「VITE_GOOGLE_CLIENT_ID」が設定されているか確認してください。\n';
        userMessage += '設定後、Vercelで再デプロイが必要です。';
      } else if (errorMessage.includes('failed to load')) {
        userMessage += '【解決方法】\n';
        userMessage += 'Google Identity Servicesライブラリの読み込みに失敗しました。\n';
        userMessage += 'ページをリロード（F5キー）して再度お試しください。';
      } else if (errorMessage.includes('popup_closed_by_user')) {
        userMessage += '【解決方法】\n';
        userMessage += '認証ポップアップが閉じられました。\n';
        userMessage += '再度「Googleカレンダー連携」ボタンをクリックしてください。';
      } else {
        userMessage += '【確認事項】\n';
        userMessage += '1. ブラウザのコンソール（F12キー）で詳細なエラー情報を確認\n';
        userMessage += '2. Google Cloud Consoleの設定を確認\n';
        userMessage += '3. ポップアップブロッカーが無効になっているか確認\n';
        userMessage += `4. 現在のURL: ${config.currentOrigin}\n`;
        userMessage += `5. Client ID: ${config.clientId.substring(0, 30)}...`;
      }
      
      alert(userMessage);
    } finally {
      setIsAuthenticating(false);
      console.log('認証処理が完了しました');
    }
  };

  // Google認証を解除
  const handleGoogleLogout = () => {
    clearAccessToken();
    setIsGoogleAuthenticated(false);
    alert('Googleカレンダーへの連携を解除しました。');
  };

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // 詳細なエラー情報をコンソールに出力
        console.group('=== Error fetching todos ===');
        console.error('Error object:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        console.error('Error status:', (error as any).status);
        console.error('Error statusText:', (error as any).statusText);
        try {
          const errorStr = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
          console.error('Full error JSON:', errorStr);
        } catch (e) {
          console.error('Could not stringify error:', e);
          console.error('Error keys:', Object.keys(error));
          console.error('Error values:', Object.values(error));
        }
        console.groupEnd();
        
        // エラーの種類に応じたメッセージ（アラートで詳細を表示）
        let errorMessage = 'TODO fetch failed\n\n';
        errorMessage += `Code: ${error.code || 'unknown'}\n`;
        errorMessage += `Message: ${error.message || 'An error occurred'}\n`;
        if (error.details) {
          errorMessage += `Details: ${error.details}\n`;
        }
        if (error.hint) {
          errorMessage += `Hint: ${error.hint}\n`;
        }
        
        if (error.code === 'PGRST116') {
          errorMessage += '\nRLS policy issue. Please run fix-policies.sql in Supabase dashboard.';
        } else if (error.code === '42P01') {
          errorMessage += '\nTable does not exist. Please run setup-database.sql in Supabase dashboard.';
        } else if (error.message?.includes('JWT') || error.message?.includes('auth')) {
          errorMessage += '\nAuthentication key issue. Please check VITE_SUPABASE_ANON_KEY in .env file.';
        } else if (error.message?.includes('ISO-8859-1')) {
          errorMessage += '\nCharacter encoding issue. Please check browser console for details.';
        }
        
        alert(errorMessage);
      } else {
        console.log('TODO fetch successful:', data?.length || 0, 'items');
        setTodos(data || []);
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
      alert(`Unexpected error occurred: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Supabase connection check
    const checkConnection = async () => {
      console.log('Checking Supabase connection...');
      console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? `${import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 20)}...` : 'not set');
      
      const { data, error } = await supabase.from('todos').select('id').limit(1);
      if (error) {
        console.error('Supabase connection error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        
        if (error.code === '42P01') {
          alert('Database table does not exist.\n\nPlease run migration in Supabase dashboard.\n\nSee README for details.');
        } else if (error.code === 'PGRST116') {
          alert('RLS policy issue.\n\nPlease check RLS policies in Supabase dashboard.');
        } else {
          alert(`Supabase connection error\n\nCode: ${error.code}\nMessage: ${error.message}\n\nCheck browser console for details.`);
        }
      } else {
        console.log('Supabase connection successful!');
      }
    };
    checkConnection();
    fetchTodos();
  }, []);

  const handleAddTodo = async (data: { title: string; content: string; deadline: string | null; important: boolean }) => {
    console.group('=== Adding todo ===');
    console.log('Data:', data);
    
    const { data: insertedData, error } = await supabase.from('todos').insert({
      title: data.title,
      content: data.content,
      deadline: data.deadline,
      important: data.important,
    }).select();

    if (error) {
      console.group('=== Error adding todo ===');
      console.error('Error object:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      try {
        const errorStr = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
        console.error('Full error JSON:', errorStr);
      } catch (e) {
        console.error('Could not stringify error:', e);
      }
      console.groupEnd();
      throw error;
    }
    
    console.log('Success! Inserted data:', insertedData);
    console.groupEnd();
    await fetchTodos();
    
    // 期限日がある場合は自動的にGoogleカレンダーに追加
    if (data.deadline && insertedData && insertedData[0]) {
      const accessToken = getStoredAccessToken();
      
      if (accessToken && isGoogleAuthenticated) {
        // OAuth認証済みの場合は自動的にイベントを作成
        try {
          await addTodoToGoogleCalendarAPI({
            title: data.title,
            content: data.content,
            deadline: data.deadline,
          }, accessToken);
        } catch (error) {
          console.error('Google Calendar API error:', error);
          // APIエラーの場合は、URLスキームでフォールバック
          setTimeout(() => {
            addTodoToGoogleCalendar({
              title: data.title,
              content: data.content,
              deadline: data.deadline,
            });
          }, 500);
        }
      } else {
        // 認証されていない場合は、URLスキームでカレンダーを開く
        setTimeout(() => {
          addTodoToGoogleCalendar({
            title: data.title,
            content: data.content,
            deadline: data.deadline,
          });
        }, 500);
      }
    }
  };

  const handleUpdateTodo = async (data: { title: string; content: string; deadline: string | null; important: boolean }) => {
    if (!editingTodo) return;

    const { error } = await supabase
      .from('todos')
      .update({
        title: data.title,
        content: data.content,
        deadline: data.deadline,
        important: data.important,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editingTodo.id);

    if (error) {
      console.error('Error updating todo:', error);
      throw error;
    }

    await fetchTodos();
  };

  const handleDeleteTodo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this TODO?')) return;

    const { error } = await supabase.from('todos').delete().eq('id', id);

    if (error) {
      console.error('Error deleting todo:', error);
      alert('Failed to delete TODO');
      return;
    }

    await fetchTodos();
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    const { error } = await supabase
      .from('todos')
      .update({ completed, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error updating todo:', error);
      alert('Failed to update TODO');
      return;
    }

    await fetchTodos();
  };

  const openAddForm = () => {
    setEditingTodo(undefined);
    setIsFormOpen(true);
  };

  const openEditForm = (todo: Todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTodo(undefined);
  };

  const counts = {
    all: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">TODOリスト</h1>
              <p className="text-gray-600">タスクを管理して、効率的に作業を進めましょう</p>
            </div>
            <div className="flex flex-col gap-2">
              {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
                <>
                  {isGoogleAuthenticated ? (
                    <button
                      onClick={handleGoogleLogout}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      Google連携解除
                    </button>
                  ) : (
                    <button
                      onClick={handleGoogleAuth}
                      disabled={isAuthenticating}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAuthenticating ? '認証中...' : 'Googleカレンダー連携'}
                    </button>
                  )}
                  {isGoogleAuthenticated && (
                    <span className="text-xs text-green-600 text-center">✓ 自動追加有効</span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={openAddForm}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md font-medium"
          >
            <Plus size={20} />
            新しいTODO
          </button>

          <button
            onClick={fetchTodos}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
            更新
          </button>
        </div>

        <div className="mb-6">
          <FilterButtons currentFilter={filter} onFilterChange={setFilter} counts={counts} />
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <RefreshCw size={48} className="mx-auto text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">読み込み中...</p>
          </div>
        ) : (
          <TodoList
            todos={todos}
            filter={filter}
            onEdit={openEditForm}
            onDelete={handleDeleteTodo}
            onToggleComplete={handleToggleComplete}
          />
        )}
      </div>

      {isFormOpen && (
        <TodoForm
          todo={editingTodo}
          onSubmit={editingTodo ? handleUpdateTodo : handleAddTodo}
          onClose={closeForm}
        />
      )}
    </div>
  );
}

export default App;
