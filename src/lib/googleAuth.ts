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
            callback: (response: { access_token: string }) => void;
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
 * Google OAuth認証を初期化してアクセストークンを取得
 * @returns Promise<string> アクセストークン
 */
export function initializeGoogleAuth(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!GOOGLE_CLIENT_ID) {
      reject(new Error('Google Client ID is not configured'));
      return;
    }

    // Google Identity Servicesライブラリが読み込まれるまで待つ
    const checkGoogle = setInterval(() => {
      if (window.google?.accounts?.oauth2) {
        clearInterval(checkGoogle);
        
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/calendar',
          callback: (response) => {
            if (response.access_token) {
              // アクセストークンをlocalStorageに保存
              localStorage.setItem('google_access_token', response.access_token);
              resolve(response.access_token);
            } else {
              reject(new Error('Failed to get access token'));
            }
          },
        });

        // アクセストークンをリクエスト
        client.requestAccessToken();
      }
    }, 100);

    // タイムアウト（10秒）
    setTimeout(() => {
      clearInterval(checkGoogle);
      reject(new Error('Google Identity Services library failed to load'));
    }, 10000);
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
