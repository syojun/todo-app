import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Todo } from '../types/database';

interface TodoFormProps {
  todo?: Todo;
  onSubmit: (data: { title: string; content: string; deadline: string | null }) => Promise<void>;
  onClose: () => void;
}

export default function TodoForm({ todo, onSubmit, onClose }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setContent(todo.content);
      if (todo.deadline) {
        const date = new Date(todo.deadline);
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        setDeadline(localDate.toISOString().slice(0, 16));
      }
    }
  }, [todo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        content,
        deadline: deadline ? new Date(deadline).toISOString() : null,
      });
      if (!todo) {
        setTitle('');
        setContent('');
        setDeadline('');
      }
      onClose();
    } catch (error: any) {
      console.group('=== Error submitting todo ===');
      console.error('Error object:', error);
      console.error('Error code:', error?.code);
      console.error('Error message:', error?.message);
      console.error('Error details:', error?.details);
      console.error('Error hint:', error?.hint);
      try {
        const errorStr = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
        console.error('Full error JSON:', errorStr);
      } catch (e) {
        console.error('Could not stringify error:', e);
      }
      console.groupEnd();
      
      const errorMessage = error?.message || error?.details || 'An unknown error occurred';
      alert(`Failed to save TODO\n\nError: ${errorMessage}\n\nPlease check the browser console for details.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {todo ? 'TODOを編集' : '新しいTODO'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="TODOのタイトルを入力"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              内容
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="TODOの詳細を入力"
            />
          </div>

          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
              期限
            </label>
            <input
              type="datetime-local"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '保存中...' : '保存'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
