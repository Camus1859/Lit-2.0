import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("task-card")
export class TaskCard extends LitElement {
  static styles = css`
    .card-container {
      border: 1px solid black;
      width: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 20px;
    }

    .priority-red {
      color: red;
    }

    .priority-yellow {
      color: yellow;
    }

    .priority-green {
      color: green;
    }

    .button-container {
      width: 100%;
    }

    .btn {
      min-width: 100px;
    }
  `;

  @property()
  task: {
    title: string;
    description: string;
    priority: string;
    status: string;
    id: string;
  } = {
    title: "",
    description: "",
    priority: "",
    status: "",
    id: Math.random().toString(),
  };

  render() {
    return html`
      <div class="card-container" draggable="true">
        <p>Title: ${this.task.title}</p>
        <p>Description: ${this.task.description}</p>
        <p>
          Priority:
          <span class="priority-${this.getPriorityColor(this.task.priority)}">
            ${this.task.priority}
          </span>
        </p>
        <div class="button-container">
          <button class="btn" @click=${this.deleteTask}>Delete</button>
          <button class="btn" @click=${this.editTask}>Edit</button>
        </div>
      </div>
    `;
  }

  getPriorityColor(priority: string) {
    if (priority === "high") {
      return "red";
    } else if (priority === "medium") {
      return "yellow";
    } else {
      return "green";
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("dragstart", this._onDragStart, { passive: false });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("dragstart", this._onDragStart);
  }

  _onDragStart(event: DragEvent) {
    const transferedData = event.dataTransfer;

    if (transferedData) {
      transferedData.effectAllowed = "move";

      console.log(this.task.id);

      transferedData.setData("text/plain", this.task.id);
    }
  }

  deleteTask() {
    const options = {
      detail: { id: this.task.id },
      bubbles: true,
      composed: true,
    };

    this.dispatchEvent(new CustomEvent("delete-task", options));
  }

  editTask() {
    const options = {
      detail: { showModal: true, id: this.task.id },
      bubbles: true,
      composed: true,
    };

    this.dispatchEvent(new CustomEvent("open-modal", options))
  }
}
