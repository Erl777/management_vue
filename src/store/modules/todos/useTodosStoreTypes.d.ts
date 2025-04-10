declare namespace TodosStore {
  type Todo = {
    id: number;
    title: string;
    description: string | null;
    urgent: boolean;
    important: boolean;
    deferred: string | null;
    isDone: boolean;
    done: string | null;
    repeated: boolean;
    priority: number;
    hidden: string | null;
  };

  type TodoList = Todo[];
}
