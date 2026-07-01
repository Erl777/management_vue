
export interface Todo {
  id: number;
  title: string;
  description: string | null;
  isDone: boolean;
  // потерял смысл
  urgent: boolean;
  important: boolean;
  deferred: string | null;
  done: string | null;
  repeated: boolean;
  priority: number;
  hidden: string | null;
  // New
  name: string,
  created: Date,
  start: Date, // "2026-06-17T04:15:00.000Z",
  end: Date, // "2026-06-17T05:00:00.000Z"
  color: string,
  timed: boolean
}

export type Todos = Todo[];

export type RightOfAccess = "readwrite" | "readonly";

