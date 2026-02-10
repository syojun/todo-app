/**
 * Googleカレンダーにイベントを追加するユーティリティ関数
 */

/**
 * TODOをGoogleカレンダーのイベントとして追加する
 * @param todo - 追加するTODOアイテム
 */
export function addTodoToGoogleCalendar(todo: { title: string; content: string; deadline: string | null }) {
  if (!todo.deadline) {
    alert('期限日が設定されていないTODOはカレンダーに追加できません。');
    return;
  }

  try {
    const deadlineDate = new Date(todo.deadline);
    
    // 日付が有効か確認
    if (isNaN(deadlineDate.getTime())) {
      alert('無効な日付です: ' + todo.deadline);
      return;
    }
    
    // Google Calendar URL形式に変換
    // 開始時刻: 期限日の1時間前（デフォルト）
    const startDate = new Date(deadlineDate);
    startDate.setHours(startDate.getHours() - 1);
    
    // 終了時刻: 期限日
    const endDate = new Date(deadlineDate);

    // ISO 8601形式に変換（YYYYMMDDTHHmmssZ）
    // Google CalendarはUTC形式を要求する
    const formatDate = (date: Date): string => {
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      const seconds = String(date.getUTCSeconds()).padStart(2, '0');
      return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
    };

    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);

    // イベントの詳細をURLエンコード
    const title = encodeURIComponent(todo.title);
    const details = encodeURIComponent(todo.content || '');
    const location = encodeURIComponent('');

    // Google Calendar URLを作成
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateStr}/${endDateStr}&details=${details}&location=${location}`;

    // 新しいウィンドウでGoogleカレンダーを開く
    const newWindow = window.open(googleCalendarUrl, '_blank');
    
    if (!newWindow) {
      // ポップアップがブロックされた場合、URLを表示してコピーできるようにする
      const message = `ポップアップがブロックされました。\n\n以下のURLをコピーしてブラウザで開いてください:\n\n${googleCalendarUrl}`;
      alert(message);
      
      // クリップボードにコピーを試みる
      if (navigator.clipboard) {
        navigator.clipboard.writeText(googleCalendarUrl).then(() => {
          alert('URLをクリップボードにコピーしました。');
        }).catch(() => {
          // コピーに失敗した場合は何もしない
        });
      }
    } else {
      // 成功メッセージを表示
      alert('Googleカレンダーを開きました。イベントを確認して「保存」をクリックしてください。');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    alert('Googleカレンダーへの追加中にエラーが発生しました。\n\nエラー: ' + errorMessage + '\n\n期限日: ' + todo.deadline);
  }
}

/**
 * Google Calendar APIを使用して直接イベントを作成する（OAuth認証が必要）
 * この関数を使用するには、Google Calendar APIの設定とOAuth認証が必要です
 * 
 * @param todo - 追加するTODOアイテム
 * @param accessToken - Google OAuthアクセストークン
 */
export async function addTodoToGoogleCalendarAPI(
  todo: { title: string; content: string; deadline: string | null },
  accessToken: string
): Promise<void> {
  if (!todo.deadline) {
    throw new Error('期限日が設定されていないTODOはカレンダーに追加できません。');
  }

  const deadlineDate = new Date(todo.deadline);
  const startDate = new Date(deadlineDate);
  startDate.setHours(startDate.getHours() - 1);
  const endDate = deadlineDate;

  const event = {
    summary: todo.title,
    description: todo.content || '',
    start: {
      dateTime: startDate.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  };

  try {
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Google Calendar API error: ${error.error?.message || 'Unknown error'}`);
    }

    const result = await response.json();
    console.log('Event created:', result);
    alert('Googleカレンダーにイベントを追加しました！');
  } catch (error) {
    console.error('Error adding event to Google Calendar:', error);
    throw error;
  }
}
