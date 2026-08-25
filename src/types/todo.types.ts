export interface Todo {
  id: string;
  description: string | null;
  isDone: boolean;
  deferred: Date | null;
  done: Date | null;
  repeated: boolean;
  name: string;
  created: Date;
  start: Date;
  end: Date;
  color: string;
  timed: boolean;
}

export interface TodoWithMultipleDates extends Omit<Todo, 'deferred'> {
  deferred: Date[];
}

export type TodoShortTimeObj = Pick<Todo, 'deferred' | 'start' | 'end'>;

export type TodoId = Todo['id'];

export type Todos = Todo[];

export interface TodoForm extends Omit<
  Todo,
  | 'id'
  | 'created'
  | 'start'
  | 'end'
  | 'repeated'
  | 'deferred'
> {
  id?: string | null;
  created: Date | null;
  start: Date | null;
  end: Date | null;
  deferred: Date | Date[] | null;
  repeated?: boolean;
}

export type TodoDeferredType = 'single' | 'everyday' | 'selected';
