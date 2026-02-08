import { CheckCircle2, Circle, ListTodo } from 'lucide-react';
import TodoItem from './TodoItem';
import type { Todo } from '../types/database';

interface TodoListProps {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
}

export default function TodoList({ todos, filter, onEdit, onDelete, onToggleComplete }: TodoListProps) {
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  if (filteredTodos.length === 0) {
    return (
      <div className="text-center py-12">
        <ListTodo size={64} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg">
          {filter === 'active' && 'アクティブなTODOはありません'}
          {filter === 'completed' && '完了したTODOはありません'}
          {filter === 'all' && 'TODOがありません。新しいTODOを追加しましょう！'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
}

interface FilterButtonsProps {
  currentFilter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
}

export function FilterButtons({ currentFilter, onFilterChange, counts }: FilterButtonsProps) {
  const buttons: Array<{
    filter: 'all' | 'active' | 'completed';
    label: string;
    icon: typeof ListTodo;
    count: number;
  }> = [
    { filter: 'all', label: 'すべて', icon: ListTodo, count: counts.all },
    { filter: 'active', label: '進行中', icon: Circle, count: counts.active },
    { filter: 'completed', label: '完了', icon: CheckCircle2, count: counts.completed },
  ];

  return (
    <div className="flex gap-2">
      {buttons.map(({ filter, label, icon: Icon, count }) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            currentFilter === filter
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          }`}
        >
          <Icon size={18} />
          <span className="font-medium">{label}</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              currentFilter === filter ? 'bg-blue-700' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {count}
          </span>
        </button>
      ))}
    </div>
  );
}
