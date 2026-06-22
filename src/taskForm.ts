import { LitElement, html, css } from "lit";
import { property, customElement, query } from "lit/decorators.js";

@customElement("task-form")
export class TaskForm extends LitElement {
  static styles = css``;
  @query(".title-input", true) _titleInput!: HTMLInputElement;
  @query(".description-text-area", true) _descriptionTextArea!: HTMLTextAreaElement;
  @query(".priority-input", true) _priorityInput!: HTMLInputElement;

  render() {
    return html`<div>


    <p>Title:</p>
    <input class="title-input"></input>

    <label for="description">Description:</label>
    <textarea class="description-text-area" id="description" name="description" rows="5" cols="40" placeholder="Enter your description here..."></textarea>

    <p>Priority:</p>
    <input class="priority-input"></input>

    <button @click=${this._addTask}>Add Task</button>
    
    </div>`;
  }

  private _addTask() {
    const title = this._titleInput.value.trim();
    const description = this._descriptionTextArea.value.trim();
    const priority = this._priorityInput.value.trim();

    console.log(title);
    console.log(description);
    console.log(priority);
  }
}
