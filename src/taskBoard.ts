import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "./taskColumn.ts";
import "./taskForm.ts";
import "./taskModal.ts";
import "./taskEdit.ts";
import { PriorityFilter, SortFilter, Task } from "./type/task.ts";

@customElement("task-board")
export class TaskBoard extends LitElement {
  static styles = css`
    .column-container {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }
  `;

  @state()
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

  @state()
  showModal: Boolean = false;

  @state()
  taskToEdit: Task | null = null;

  @state()
  priorityFilter: PriorityFilter = PriorityFilter.All;

  @state()
  sort: SortFilter = SortFilter.Default;

  render() {
    return html`
      <div>
        <task-modal
          @close-modal=${this._closeModal}
          .showModal=${this.showModal}
        >
          <task-edit
            @edit-task=${this._handleEditTask}
            .taskToEdit=${this.taskToEdit}
          ></task-edit>
        </task-modal>
        <task-form
          @filter-task=${this._handlePriorityFilter}
          @add-task=${this._handleTaskAdded}
          @sort-task=${this._handleSort}
        ></task-form>
        <div class="column-container">
          <task-column
            .columnType=${"To Do"}
            .tasks=${this.getTasks(this.tasks, "todo")}
            @task-moved=${this._handleTaskMoved}
            .status=${"todo"}
            @delete-task=${this._handleDeleteTask}
            @open-modal=${this._handleModal}
          ></task-column>
          <task-column
            .columnType=${"In Progress"}
            .tasks=${this.getTasks(this.tasks, "in progress")}
            @task-moved=${this._handleTaskMoved}
            .status=${"in progress"}
            @delete-task=${this._handleDeleteTask}
            @open-modal=${this._handleModal}
          ></task-column>
          <task-column
            .columnType=${"Done"}
            .tasks=${this.getTasks(this.tasks, "done")}
            @task-moved=${this._handleTaskMoved}
            .status=${"done"}
            @delete-task=${this._handleDeleteTask}
            @open-modal=${this._handleModal}
          ></task-column>
        </div>
      </div>
    `;
  }

  getTasks(tasks: Task[], status: string) {
    const priorityWeight: { [key: string]: number } = {
      high: 1,
      medium: 2,
      low: 3,
    };

    return tasks
      .filter(
        (task) =>
          task.status.toLowerCase() === status.toLowerCase() &&
          (this.priorityFilter === "all" ||
            task.priority === this.priorityFilter),
      )
      .sort((a: Task, b: Task) => {
        if (this.sort === "default") {
          return 0;
        }

        if (this.sort === "high") {
          return priorityWeight[a.priority] - priorityWeight[b.priority];
        } else {
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
      });
  }

  _handleTaskAdded(e: CustomEvent) {
    this.tasks = [...this.tasks, e.detail.task];
  }

  _handleTaskMoved(e: CustomEvent) {
    const taskId = e.detail.id;
    const columnName = e.detail.columnName;

    this.tasks = this.tasks.map((task) => {
      return task.id === taskId ? { ...task, status: columnName } : task;
    });
  }

  _handleDeleteTask(e: CustomEvent) {
    const taskId = e.detail.id;

    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }

  _handleModal(e: CustomEvent) {
    console.log("fired");
    this.showModal = e.detail.showModal;

    this.taskToEdit =
      this.tasks.find((task) => task.id === e.detail.id) ?? null;
  }

  _closeModal(e: CustomEvent) {
    this.showModal = e.detail.showModal;
  }

  _handleEditTask(e: CustomEvent) {
    this.showModal = e.detail.showModal;
    this.tasks = this.tasks.map((task) =>
      task.id === e.detail.task.id ? { ...e.detail.task } : task,
    );
  }

  _handlePriorityFilter(e: CustomEvent) {
    console.log(e.detail.filterValue);
    this.priorityFilter = e.detail.filterValue;
  }

  _handleSort(e: CustomEvent) {
    this.sort = e.detail.sortValue;
  }
}
