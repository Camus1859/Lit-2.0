import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("task-modal")
export class TaskModal extends LitElement {
  @property()
  showModal: Boolean = false;

  static styles = css`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .modal-box {
      background: #ffffff;
      padding: 24px;
      border-radius: 8px;
      position: relative;
    }

    .close-btn {
      position: absolute;
      top: 12px;
      right: 16px;
      font-size: 24px;
      font-weight: bold;
      color: #666666;
      cursor: pointer;
    }

    .close-btn:hover {
      color: #000000; /* Darkens on hover for feedback */
    }
  `;

  render() {
    if (this.showModal === false) {
      return;
    }
    return html`
      <div id="customModal" class="modal-overlay">
        <div class="modal-box">
          <span @click=${this.modal} class="close-btn" id="closeModalBtn"
            >&times;</span
          >
          <slot></slot>
        </div>
      </div>
    `;
  }

  modal() {
    const options = {
      detail: { showModal: false },
      bubbles: true,
      composed: true,
    };

    this.dispatchEvent(new CustomEvent("close-modal", options));
  }
}
