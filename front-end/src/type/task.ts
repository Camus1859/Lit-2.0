export interface Task {
  title: string;
  description: string;
  priority: string;
  status: string;
  id: string;
}

export enum PriorityFilter {
  High = "high",
  Medium = "medium",
  Low = "low",
  All = "all"
}

export enum SortFilter {
  Default = "default",
  High = "high",
  Low = "low"
}
