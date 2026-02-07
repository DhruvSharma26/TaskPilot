
export enum Priority {
  LOW = 'Low',
  MODERATE = 'Moderate',
  HIGH = 'High'
}

export enum Status {
  PENDING = 'Pending',
  COMPLETED = 'Completed'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  createdAt: number;
}

export type View = 'Dashboard' | 'All' | 'Pomodoro' | 'TaskDetails';

export interface AIResponse {
  text: string;
  isLoading: boolean;
  error?: string;
}
