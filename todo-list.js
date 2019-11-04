const template = document.createElement('template');

template.innerHTML = `
    <style>
        .todo {
            border: 1px solid gold;
        }
    </style>
    <h1>Todos</h1>
    <div class="todos">
    </div>
`
class TodoListElement extends HTMLElement {

    _todos;

    constructor() {
        super();
    }

    connectedCallback() {
        this._shadowRoot = this.attachShadow({ 'mode': 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        this.$todos = this._shadowRoot.querySelector('.todos');

        var url = "https://jsonplaceholder.typicode.com/todos";

        let promise = fetch(url);

        promise.then(function(response) {
                return response.json();
            })
            .then(function(todos) {
                this._todos = todos;

                let idsToRemove = this.getIdsRemoved();
                todos = todos.filter(todo => !idsToRemove.includes(todo.id + ""));
                todos.forEach(todo => {
                    let $todo = document.createElement("my-todo");
                    $todo.setAttribute("my-id", todo.id);
                    $todo.setAttribute("my-title", todo.title);
                    $todo.setAttribute("my-completed", todo.completed);
                    this.$todos.appendChild($todo);
                    $todo.addEventListener("onTodoRemoveEvent", function(e) {
                        let id = e.detail.id;
                        let $todo = this.$todos.querySelector(`[my-id='${id}']`);
                        this.$todos.removeChild($todo);
                        this.saveOp(id);
                    }.bind(this));
                });

            }.bind(this));


        window.addEventListener('storage', function(e) {
            if (e.key === 'my-todo-removed-ids') {
                this.reload();
            }
        }.bind(this), false);
    }

    get todos() {
        return this._todos;
    }

    set todos(todos) {
        this._todos = todos;
    }

    reload() {
        let idsToRemove = this.getIdsRemoved();
        for (let i = 0; i < idsToRemove.length; i++) {
            let id = idsToRemove[i];
            let $todo = this.$todos.querySelector(`[my-id='${id}']`);
            if ($todo) {
                this.$todos.removeChild($todo);
            }
        }
    }

    saveOp(id) {
        let temp = window.localStorage.getItem('my-todo-removed-ids');
        if (temp) {
            temp = JSON.parse(temp);
        } else {
            temp = {};
        }
        temp[id] = true;
        window.localStorage.setItem('my-todo-removed-ids', JSON.stringify(temp));
    }

    getIdsRemoved() {
        try {
            return Object.keys(JSON.parse(window.localStorage.getItem('my-todo-removed-ids')));
        } catch (e) {
            return [];
        }
    }
}

window.customElements.define('my-todos', TodoListElement);