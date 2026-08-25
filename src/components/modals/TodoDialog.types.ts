import type { TodoId } from '@/types';

export interface ModalProps {
  todoId?: TodoId | null;
  withButton?: boolean;
}

export interface ModalInstance {
  openModal: () => void;
}
