let taskText = document.getElementById('task-text');
let addTaskBtn =  document.getElementById("add-task");

taskText.addEventListener("keypress", (e) =>{
    if(e.key === "Enter"){
        addTaskBtn.click()
    }
})

 
 
 addTaskBtn.onclick = function () {
    let taskText = document.getElementById('task-text').value.trim();
    if (taskText === "") return;
    let task = createTaskElement(taskText);

   let todoList = document.querySelector("#todo .task-list");



   todoList.appendChild(task);

    saveTask();
    document.getElementById('task-text').value = "";
}


function createTaskElement(text, color = null) {
    let task = document.createElement('div');
    task.classList.add('task');
    task.setAttribute("draggable", "true");

    if(color){
        task.style.backgroundColor = color;
    }

    let span = document.createElement('span');
    span.textContent = text;

   let timestamp = document.createElement('p');
    timestamp.classList.add('timestamp');
   timestamp.textContent = new Date().toLocaleString(); // Current date and time

    let deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-task');

    deleteBtn.addEventListener('click', () => {
        task.remove();
        saveTask();
    });

   task.appendChild(timestamp); // Append timestamp to the task
    task.appendChild(span);
    task.appendChild(deleteBtn);
    

    //drag events
    task.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData("text", span.textContent);
        event.target.classList.add('dragging');
    });

    task.addEventListener("dragend", (event) => {
        event.target.classList.remove("dragging");
    });

    //double click to edit task
    task.addEventListener("dblclick", function () {
        let input = document.createElement('input');
        input.type = 'text';
        input.classList.add('edit');
        input.value = span.textContent;
        task.replaceWith(input);
        input.focus();

        input.addEventListener("blur", function () {
            let newText = input.value.trim();
            if (newText) {
                span.textContent = newText;
                input.replaceWith(task);
                saveTask();
            } else {
                input.replaceWith(task);
            }
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === "Enter") {
                input.blur();
            }
        });
    });
    return task;
}

document.querySelectorAll('.column .task-list').forEach(
    column => {
        column.addEventListener("dragover", (e) => {
            e.preventDefault();
            column.style.backgroundColor = "#ddd";
        });
        column.addEventListener("dragleave", (e) => {
            e.preventDefault();
            column.style.backgroundColor = "";
        });
        column.addEventListener("drop", (e) => {
            let text = e.dataTransfer.getData("text");
            let oldTask = document.querySelector(".dragging");

            if(oldTask) oldTask.remove();

            let task = createTaskElement(text);

            if (column.id === "todo") {
                task.style.backgroundColor = "blue";
            } else if (column.id === "in-progress") {
                task.style.backgroundColor = "yellow";
            } else if (column.id === "done") {
                task.style.backgroundColor = "green";
            }

            column.appendChild(task);
            column.style.backgroundColor = ""
            saveTask();
        });
    });

function saveTask() {
    let tasks = {
        todo: [],
        inProgress: [],
        done: [],
       
    };

    
    document.querySelectorAll("#todo .task").forEach(task => 
        tasks.todo.push( {
            text: task.querySelector('span').textContent,
            color:   task.style.backgroundColor
        }
          
        ));

    document.querySelectorAll("#in-progress .task").forEach(task => 
        tasks.inProgress.push(
            {
                text: task.querySelector('span').textContent,
                color:   task.style.backgroundColor
            }
        ));

    document.querySelectorAll("#done .task").forEach(task => 
        tasks.done.push(
            {
                text: task.querySelector('span').textContent,
                color:   task.style.backgroundColor
            }
        ));

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks"));

    if (!tasks) return;

    tasks.todo.forEach(task => 
      document.querySelector("#todo .task-list").appendChild(createTaskElement(task.text, task.color)));

      tasks.inProgress.forEach(task => 
        document.querySelector("#in-progress .task-list").appendChild(createTaskElement(task.text, task.color)));

        tasks.done.forEach(task => 
            document.querySelector("#done .task-list").appendChild(createTaskElement(task.text, task.color)));
}

loadTasks();
