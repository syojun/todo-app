export type Database = {
  public: {
    Tables: {
      todos: {
        Row: {
          id: string;
          title: string;
          content: string;
          deadline: string | null;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content?: string;
          deadline?: string | null;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          deadline?: string | null;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

export type Todo = Database['public']['Tables']['todos']['Row'];
