let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");
let saveTodoButton = document.getElementById("saveTodoButton");

let todoList = [];

async function loadTodos() {
    let res = await fetch("/todos");
    let data = await res.json();
    todoList = data;
    todoItemsContainer.innerHTML = "";

    data.forEach((todo, index) => {
        createAndAppendTodo(todo, index);
    });
}

function onTodoStatusChange(labelId, index) {
    let labelElement = document.getElementById(labelId);
    labelElement.classList.toggle("checked");

    todoList[index].isChecked = !todoList[index].isChecked;
}

function onDeleteTodo(todoId, index) {
    let todoElement = document.getElementById(todoId);
    todoItemsContainer.removeChild(todoElement);

    todoList.splice(index, 1);
}

function createAndAppendTodo(todo, index) {
    let checkboxId = "checkbox" + index;
    let labelId = "label" + index;
    let todoId = "todo" + index;

    let li = document.createElement("li");
    li.id = todoId;
    li.classList.add("todo-item-container", "d-flex", "flex-row");

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.isChecked;
    checkbox.classList.add("checkbox-input");

    checkbox.onclick = function() {
        onTodoStatusChange(labelId, index);
    };

    let labelContainer = document.createElement("div");
    labelContainer.classList.add("label-container", "d-flex", "flex-row");

    let label = document.createElement("label");
    label.id = labelId;
    label.classList.add("checkbox-label");
    label.textContent = todo.text;

    if (todo.isChecked) {
        label.classList.add("checked");
    }

    let deleteDiv = document.createElement("div");
    deleteDiv.classList.add("delete-icon-container", "d-flex", "flex-column", "justify-content-center");

    let deleteIcon = document.createElement("i");
    deleteIcon.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
    </svg>`;
    deleteIcon.classList.add("pr-2");
    deleteDiv.appendChild(deleteIcon);

    deleteIcon.onclick = function() {
        onDeleteTodo(todoId, index);
    };

    deleteDiv.appendChild(deleteIcon);
    labelContainer.appendChild(label);
    labelContainer.appendChild(deleteDiv);

    li.appendChild(checkbox);
    li.appendChild(labelContainer);

    todoItemsContainer.appendChild(li);
}

addTodoButton.onclick = function() {
    let input = document.getElementById("todoUserInput");
    let value = input.value;

    if (value === "") {
        alert("Enter Valid Text");
        return;
    }

    let newTodo = {
        text: value,
        isChecked: false
    };

    todoList.push(newTodo);
    createAndAppendTodo(newTodo, todoList.length - 1);

    input.value = "";
};


saveTodoButton.onclick = async function() {
    await fetch("/saveTodos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(todoList)
    });

    alert("Saved to Database");
};

loadTodos();