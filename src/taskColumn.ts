import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import "./taskCard.ts";
import { Task } from "./type/task.ts";

@customElement("task-column")
export class TaskColumn extends LitElement {
  static styles = css`
    .column-container {
    }

    .column {
      border: 1px solid black;
      width: 400px;
      height: 100vh;
      text-align: center;
      font-size: 20px;
      padding-top: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  `;

  @property()
  tasks: Task[] = [];

  @property()
  columnType: string = "";

  @property()
  status: string = "";

  render() {
    return html`
      <div class="column">
        ${this.columnType}
        ${this.tasks.map((task) => {
          return html`<task-card .task=${task}></task-card>`;
        })}
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();

    this.addEventListener("drop", this._onDrop);
    this.addEventListener("dragover", this._onDragOver);
  }

  _onDrop(event: DragEvent) {
    console.log("rannn");
    const transferData = event.dataTransfer;

    const taskId = transferData?.getData("text/plain");

    console.log(this.status);

    const options = {
      detail: { id: taskId, columnName: this.status },
      bubbles: true,
      composed: true,
    };

    this.dispatchEvent(new CustomEvent("task-moved", options));
  }

  _onDragOver(event: DragEvent) {
    event.preventDefault();
  }
}
