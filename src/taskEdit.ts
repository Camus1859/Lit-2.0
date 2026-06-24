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

    <p>Title:</p>
    <input
    .value=${this.taskToEdit?.title}
    @input=${(e: Event)=> {
        if(e.target){
            const target = e.target as HTMLInputElement;
        this.taskToEdit =  {...this.taskToEdit!, title: target.value}
        }
    }}
    />
    
    
    </div>`;
  }
}
