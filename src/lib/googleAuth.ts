/**
 * Google OAuth認証ユーティリティ
 */

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string; error_description?: string }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

/**
 * Google Identity Servicesライブラリを動的に読み込む
 */
function loadGoogleIdentityServices(): Promise<void> {
  return new Promise((resolve, reject) => {
    // 既に読み込まれている場合は即座に解決
    if (window.google?.accounts?.oauth2) {
      console.log('Google Identity Servicesライブラリは既に読み込まれています');
      resolve();
      return;
    }

    // 既にスクリプトタグが存在する場合は読み込みを待つ
    const existingScript = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
    if (existingScript) {
      console.log('Google Identity Servicesスクリプトタグが見つかりました。読み込みを待ちます...');
      let attempts = 0;
      const maxAttempts = 150; // 15秒
      
      const checkInterval = setInterval(() => {
        attempts++;
        if (window.google?.accounts?.oauth2) {
          clearInterval(checkInterval);
          console.log('✅ Google Identity Servicesライブラリが読み込まれました');
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          reject(new Error('Google Identity Servicesライブラリの読み込みがタイムアウトしました'));
        }
      }, 100);
      return;
    }

    // スクリプトタグが存在しない場合は動的に読み込む
    console.log('Google Identity Servicesライブラリを動的に読み込みます...');
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('✅ Google Identity Servicesスクリプトが読み込まれました');
      // スクリプトが読み込まれた後、少し待ってからライブラリが利用可能になるのを待つ
      let attempts = 0;
      const maxAttempts = 50; // 5秒
      
      const checkInterval = setInterval(() => {
        attempts++;
        if (window.google?.accounts?.oauth2) {
          clearInterval(checkInterval);
          console.log('✅ Google Identity Servicesライブラリが利用可能になりました');
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          reject(new Error('Google Identity Servicesライブラリが利用可能になりませんでした'));
        }
      }, 100);
    };
    
    script.onerror = () => {
      console.error('❌ Google Identity Servicesスクリプトの読み込みに失敗しました');
      reject(new Error('Google Identity Servicesスクリプトの読み込みに失敗しました。ネットワーク接続を確認してください。'));
    };
    
    document.head.appendChild(script);
  });
}

/**
 * Google OAuth認証を初期化してアクセストークンを取得
 * @returns Promise<string> アクセストークン
 */
export function initializeGoogleAuth(): Promise<string> {
  return new Promise(async (resolve, reject) => {
    console.log('=== Google認証開始 ===');
    console.log('Client ID:', GOOGLE_CLIENT_ID ? `${GOOGLE_CLIENT_ID.substring(0, 20)}...` : 'not set');
    
    if (!GOOGLE_CLIENT_ID) {
      console.error('Google Client ID is not configured');
      reject(new Error('Google Client ID is not configured'));
      return;
    }

    try {
      // Google Identity Servicesライブラリを読み込む
      await loadGoogleIdentityServices();
    
    const checkGoogle = setInterval(() => {
      attempts++;
      
      // 10回ごとにログを出力（ログが多すぎないように）
      if (attempts % 10 === 0) {
        console.log(`Googleライブラリ確認中... (${attempts}/${maxAttempts})`);
      }
      
      // ライブラリが利用可能になったので、認証クライアントを初期化
      const client = window.google!.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/calendar',
        callback: (response) => {
          console.log('OAuth callback received:', JSON.stringify(response, null, 2));
          
          if (response.access_token) {
            // アクセストークンをlocalStorageに保存
            localStorage.setItem('google_access_token', response.access_token);
            console.log('✅ アクセストークンを保存しました');
            resolve(response.access_token);
          } else if (response.error) {
            // エラーが発生した場合
            const errorCode = response.error;
            const errorMessage = response.error_description || response.error;
            console.error('❌ Google OAuth error:', {
              error: errorCode,
              description: errorMessage,
              fullResponse: response
            });
            
            // エラーコードに応じた詳細なメッセージ
            let detailedError = `エラーコード: ${errorCode}\n`;
            if (errorMessage) {
              detailedError += `詳細: ${errorMessage}\n\n`;
            }
            
            if (errorCode === 'popup_closed_by_user') {
              detailedError += 'ポップアップが閉じられました。再度お試しください。';
            } else if (errorCode === 'access_denied') {
              detailedError += 'アクセスが拒否されました。\n\n';
              detailedError += 'OAuth同意画面が「テスト」モードの場合、あなたのメールアドレス（levo.shoon511@gmail.com）を「テストユーザー」に追加してください。\n';
              detailedError += 'Google Cloud Console → OAuth同意画面 → テストユーザー';
            } else if (errorCode === 'redirect_uri_mismatch') {
              detailedError += 'リダイレクトURIが一致しません。\n\n';
              detailedError += `現在のURL: ${window.location.origin}\n\n`;
              detailedError += 'Google Cloud Consoleで以下を設定してください:\n';
              detailedError += '1. 「承認済みのJavaScript生成元」に追加:\n';
              detailedError += `   - ${window.location.origin}\n`;
              detailedError += '2. 「承認済みのリダイレクトURI」に追加:\n';
              detailedError += `   - ${window.location.origin}\n`;
              detailedError += '3. OAuth 2.0 クライアントIDを確認';
            } else {
              detailedError += '認証に失敗しました。ブラウザのコンソールで詳細を確認してください。';
            }
            
            reject(new Error(detailedError));
          } else {
            console.error('❌ アクセストークンが取得できませんでした。レスポンス:', response);
            reject(new Error('アクセストークンの取得に失敗しました。レスポンスにaccess_tokenが含まれていません。'));
          }
        },
      });

      console.log('アクセストークンをリクエストします...');
      // アクセストークンをリクエスト
      client.requestAccessToken();
    } catch (error) {
      console.error('❌ Google認証エラー:', error);
      reject(error);
    }
  });
}

/**
 * 保存されたアクセストークンを取得
 * @returns string | null アクセストークンまたはnull
 */
export function getStoredAccessToken(): string | null {
  return localStorage.getItem('google_access_token');
}

/**
 * アクセストークンを削除
 */
export function clearAccessToken(): void {
  localStorage.removeItem('google_access_token');
}

/**
 * アクセストークンが有効か確認（簡易版）
 * @param accessToken アクセストークン
 * @returns Promise<boolean> 有効な場合true
 */
export async function validateAccessToken(accessToken: string): Promise<boolean> {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + accessToken);
    const data = await response.json();
    return !data.error;
  } catch {
    return false;
  }
}

/**
 * Google認証の設定を確認
 */
export function checkGoogleAuthConfig(): {
  clientIdConfigured: boolean;
  clientId: string;
  currentOrigin: string;
  googleLibraryLoaded: boolean;
} {
  const clientId = GOOGLE_CLIENT_ID;
  const currentOrigin = window.location.origin;
  const googleLibraryLoaded = !!window.google?.accounts?.oauth2;

  console.log('=== Google認証設定確認 ===');
  console.log('Client ID設定:', clientId ? '✅ 設定済み' : '❌ 未設定');
  console.log('Client ID:', clientId ? `${clientId.substring(0, 30)}...` : 'なし');
  console.log('現在のOrigin:', currentOrigin);
  console.log('Googleライブラリ:', googleLibraryLoaded ? '✅ 読み込み済み' : '❌ 未読み込み');

  return {
    clientIdConfigured: !!clientId,
    clientId: clientId || '',
    currentOrigin,
    googleLibraryLoaded,
  };
}
