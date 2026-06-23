import { LitElement, html, css } from "lit";
import { property, customElement, query, state } from "lit/decorators.js";

@customElement("task-form")
export class TaskForm extends LitElement {
  static styles = css``;

  @state()
  title: string = "";

  @state()
  description: string = "";

  priority: string = "";

  render() {
    return html`<div>
      <div>
        <p>Title:</p>
        <input
          .value=${this.title}
          @input=${(e: Event) => {
            if (e.target) {
              const target = e.target as HTMLInputElement;
              this.title = target.value;
            }
          }}
          class="title-input"
        />
      </div>

      <div>
        <p>Description:</p>
        <label for="description"></label>
        <textarea
          .value=${this.description}
          @input=${(e: Event) => {
            if (e.target) {
              const target = e.target as HTMLTextAreaElement;
              this.description = target.value;
            }
          }}
          class="description-text-area"
          id="description"
          name="description"
          rows="5"
          cols="40"
          placeholder="Enter your description here..."
        ></textarea>

        <div>
          <label for="priority-select">Priority:</label>
          <select
            name="priorties"
            id="priority-select"
            .value=${this.priority}
            @change=${(e: Event) => {
              const target = e.target as HTMLSelectElement;
              this.priority = target.value;
            }}
          >
            <option value="">--Please choose an option--</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <button @click=${this._addTask}>Add Task</button>
      </div>
    </div>`;
  }

  private _addTask() {
    if (!this._validation()) {
      return;
    }

    const task = {
      id: Math.random().toString(),
      title: this.title,
      description: this.description,
      priority: this.priority,
      status: "todo",
    };

    const options = {
      detail: { task },
      bubbles: true,
      composed: true,
    };

    this.dispatchEvent(new CustomEvent("add-task", options));

    this.title = "";
    this.description = "";
    this.priority = "";

    console.log(task);
  }

  private _validation() {
    if (
      this.title.trim() === "" ||
      this.description.trim() === "" ||
      this.priority.trim() === ""
    ) {
      return false;
    }
    return true;
  }
}
