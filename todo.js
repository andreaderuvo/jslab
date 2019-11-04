const template = document.createElement('template');

template.innerHTML = `
    <style>
        .todo {
            border: 1px solid #ccc;
            border-radius: .3em;
            padding: 1em;
            margin-bottom: .3em;
        }

        .green {
            background: #00800047;
        }
        
        .red {
            background: #ff00004a;
        }
    </style>
    <div class="todo">
        <div class="title">
        </div>
        <div class="completed green">
        </div>
        <button class="action">Remove</button>
    </div>
`

class TodoElement extends HTMLElement {


    constructor() {
        super();
    }

    connectedCallback() {
        this._shadowRoot = this.attachShadow({ 'mode': 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        this.$title = this._shadowRoot.querySelector('.title');
        this.$completed = this._shadowRoot.querySelector('.completed');
        this.$id = this._shadowRoot.querySelector('.id');
        this.$todo = this._shadowRoot.querySelector('.todo');

        this.$title.innerHTML = this.getAttribute("my-title");
        if (this.getAttribute("my-completed") === 'true') {
            this.$todo.classList.add("green");
        } else {
            this.$todo.classList.add("red");
        }

        this.$button = this._shadowRoot.querySelector('.action');

        this.$button.addEventListener("click", (event) => {
            this.dispatchEvent(new CustomEvent('onTodoRemoveEvent', {
                detail: {
                    id: this.getAttribute("my-id")
                }
            }));
        });
    }

}

window.customElements.define('my-todo', TodoElement);