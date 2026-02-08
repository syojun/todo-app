import { Check, Clock, Edit2, Trash2 } from 'lucide-react';
import type { Todo } from '../types/database';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
}

export default function TodoItem({ todo, onEdit, onDelete, onToggleComplete }: TodoItemProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const isOverdue = (dateString: string | null) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date() && !todo.completed;
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border-2 transition-all hover:shadow-md ${
        todo.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
      } ${isOverdue(todo.deadline) ? 'border-l-4 border-l-red-500' : ''}`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggleComplete(todo.id, !todo.completed)}
            className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              todo.completed
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300 hover:border-green-500'
            }`}
          >
            {todo.completed && <Check size={14} className="text-white" />}
          </button>

          <div className="flex-1 min-w-0">
            <h3
              className={`text-lg font-medium ${
                todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}
            >
              {todo.title}
            </h3>

            {todo.content && (
              <p className={`mt-1 text-sm ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                {todo.content}
              </p>
            )}

            {todo.deadline && (
              <div
                className={`mt-2 flex items-center gap-1 text-sm ${
                  isOverdue(todo.deadline)
                    ? 'text-red-600 font-medium'
                    : todo.completed
                    ? 'text-gray-400'
                    : 'text-gray-500'
                }`}
              >
                <Clock size={14} />
                <span>{formatDate(todo.deadline)}</span>
                {isOverdue(todo.deadline) && <span className="ml-1">(期限切れ)</span>}
              </div>
            )}
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => onEdit(todo)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="編集"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
              title="削除"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
