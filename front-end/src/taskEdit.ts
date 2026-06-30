import { LitElement, css, html } from "lit";
import { state, property, customElement } from "lit/decorators.js";
import { Task } from "./type/task";

@customElement("task-edit")
export class TaskEdit extends LitElement {
  static styles = css``;

  @property()
  taskToEdit: Task | null = null;

  render() {
    return html`<div>
      <div>
        <p>Title:</p>
        <input
          .value=${this.taskToEdit?.title}
          @input=${(e: Event) => {
            if (e.target) {
              const target = e.target as HTMLInputElement;
              this.taskToEdit = { ...this.taskToEdit!, title: target.value };
            }
          }}
          class="title-input"
        />
      </div>

      <div>
        <p>Description:</p>
        <label for="description"></label>
        <textarea
          .value=${this.taskToEdit?.description}
          @input=${(e: Event) => {
            const target = e.target as HTMLInputElement;
            this.taskToEdit = {
              ...this.taskToEdit!,
              description: target.value,
            };
          }}
          class="description-text-area"
          id="description"
          name="description"
          rows="5"
          cols="40"
        >
        </textarea>
      </div>
      <div>
        <label for="priority-select">Priority:</label>
        <select
          name="priorities"
          id="priority-select"
          .value=${this.taskToEdit?.priority}
          @change=${(e: Event) => {
            const target = e.target as HTMLSelectElement;
            this.taskToEdit = { ...this.taskToEdit!, priority: target.value };
          }}
        >
          <option value="">Choose an option</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <button @click=${this._handleEdit}>Submit x</button>
    </div>`;
  }

  _handleEdit(){
    console.log("ran inside of handle Edit")

    const options = {
        detail: {task: this.taskToEdit, showModal: false},
        bubbles: true,
        composed: true
    }

    this.dispatchEvent(new CustomEvent("edit-task", options))
  }
}
