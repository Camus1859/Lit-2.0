import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import "./taskColumn.ts";
import { Task } from "./type/task.ts";

@customElement("task-board")
export class TaskBoard extends LitElement {
  static styles = css`
    .column-container {
      display: flex;
      justify-content: space-between;
    }
  `;

  @property()
  tasks: Task[] = [
    {
      title: "Set up project",
      description: "Initialize repo and install deps",
      priority: "high",
      status: "done",
      id: "1",
    },
    {
      title: "Build UI",
      description: "Create task board layout",
      priority: "medium",
      status: "in progress",
      id: "2",
    },
    {
      title: "Add drag and drop",
      description: "Enable moving tasks between columns",
      priority: "low",
      status: "todo",
      id: "3",
    },
    {
      title: "Add Edit Delete functionality",
      description: "User should be able to add and delete task",
      priority: "low",
      status: "todo",
      id: "4",
    },
  ];

  render() {
    return html`
      <div class="column-container">
        <task-column
          .columnType=${"To Do"}
          .tasks=${this.getTasks(this.tasks, "todo")}
        ></task-column>
        <task-column
          .columnType=${"In Progress"}
          .tasks=${this.getTasks(this.tasks, "in progress")}
        ></task-column>
        <task-column
          .columnType=${"Done"}
          .tasks=${this.getTasks(this.tasks, "done")}
        ></task-column>
      </div>
    `;
  }

  getTasks(tasks: Task[], status: string) {
    return tasks.filter((task) => task.status === status);
  }
}
