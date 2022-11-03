import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';

import { TreapNode } from "./node";

@customElement('ateon-treap')
class Treap extends LitElement {

  rootNode: TreapNode = new TreapNode(0);

  render() {
    return html`
      <button @click=${this.addNode}></button>

      ${this.rootNode}
    `;
  }

  addNode() {
    let node = new TreapNode(Math.random());
    this.rootNode.insert(node);
  }
}