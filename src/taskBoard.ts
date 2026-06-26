import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
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
  tasks: Task[] = [];

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

  _handleModal(e: CustomEvent) {
    console.log("fired");
    this.showModal = e.detail.showModal;

    this.taskToEdit =
      this.tasks.find((task) => task.id === e.detail.id) ?? null;
  }

  _closeModal(e: CustomEvent) {
    this.showModal = e.detail.showModal;
  }

  _handlePriorityFilter(e: CustomEvent) {
    console.log(e.detail.filterValue);
    this.priorityFilter = e.detail.filterValue;
  }

  _handleSort(e: CustomEvent) {
    this.sort = e.detail.sortValue;
  }

  async connectedCallback(): Promise<void> {
    super.connectedCallback();

    try {
      const response = await fetch("http://localhost:3000/api/tasks");

      if (!response.ok) {
        throw new Error("Unable to fetch tasks");
      }

      const data = await response.json();

      this.tasks = data;
    } catch (e) {
      console.log(e);
    }
  }

  async _handleTaskAdded(e: CustomEvent<{ task: Task }>) {
    try {
      const response = await fetch("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(e.detail.task),
      });

      if (!response.ok) {
        throw new Error("Unable to add task");
      }

      const data = await response.json();

      this.tasks = data;
    } catch (e) {
      console.log(e);
    }
  }

  async _handleTaskMoved(e: CustomEvent<{ id: string; columnName: string }>) {
    const taskId = e.detail.id;
    const columnName = e.detail.columnName;

    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: columnName }),
      });

      if (!response.ok) {
        throw new Error("Unable to update task");
      }

      const data = await response.json();

      this.tasks = data;
    } catch (e) {
      console.log(e);
    }
  }

  async _handleDeleteTask(e: CustomEvent<{ id: string }>) {
    const taskId = e.detail.id;

    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Unable to find task");
      }

      const data = await response.json();

      this.tasks = data;
    } catch (e) {
      console.log(e);
    }
  }

  async _handleEditTask(e: CustomEvent<{ showModal: boolean; task: Task }>) {
    this.showModal = e.detail.showModal;

    try {
      const response = await fetch(
        `http://localhost:3000/api/tasks/${e.detail.task.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(e.detail.task),
        },
      );

      if (!response.ok) {
        throw new Error("Unable to edit task");
      }

      const data = await response.json();

      this.tasks = data;
    } catch (e) {
      console.log(e);
    }
  }
}
