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
  `;

  @property()
  task: {
    title: string;
    description: string;
    priority: string;
    status: string;
  } = {
    title: "",
    description: "",
    priority: "",
    status: "",
  };

  render() {
    return html`
      <div class="card-container">
        <p>Title: ${this.task.title}</p>
        <p>Description: ${this.task.description}</p>
        <p>
          Priority:
          <span class="priority-${this.getPriorityColor(this.task.priority)}">
            ${this.task.priority}
          </span>
        </p>
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
}
