import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';

@customElement('treap-node')
export class TreapNode extends LitElement {
    value: number;
    priority: number;

    leftChild: TreapNode | null;
    rightChild: TreapNode | null;

    constructor(value: number, priority = -1) {
        super();

        this.value = value;

        if(priority < 0 || priority > 1) {
            this.priority = Math.random();
        } else {
            this.priority = priority;
        }
    }

    public insert (node: TreapNode) {
        if(node.value < this.value) {
            if(this.leftChild == null) {
                this.leftChild = node;
            } else {
                this.leftChild.insert(node);
            }
        } else if (node.value > this.value) {
            if(this.rightChild == null) {
                this.rightChild = node;
            } else {
                this.rightChild.insert(node);
            }
        }
    }

    render() {
        return html`
            <div class="node">
                ${this.value}
                ${this.leftChild}
                ${this.rightChild}
            </div>
        ` 
    }
}