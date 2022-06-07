const taskInput = document.querySelector(".task__input input");
const dateSelect = document.querySelector(".date__wrapper input");
filters = document.querySelectorAll(".filters span");
clearAll = document.querySelector(".clear__btn");
taskBox = document.querySelector(".task__box");
insertDate = document.querySelector(".date__btn");

let element = document.getElementById("datepicker");
let count = 0;

let editId;
let isEditedTask = false;
let taskIdToEdit;
let taskNameToEdit;
localStorage.setItem("todo__list", "[]");

// datepicker
$(function() {
    $("#datepicker").datepicker({
      weekStart: 1,
      maxViewMode: 0,
      todayHighlight: true,
    });
});

// getting localstorage todo__list
let todos = JSON.parse(localStorage.getItem("todo__list"));

filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

// when clicked it toggles a different color for the background
const colorToggle = () => {
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    document.body.style.backgroundColor = "#" + randomColor;
}

// adds new task (to local storage)
function showTodo(filter) {
    let li = "";
    if (todos) {
        todos.forEach((todo, id) => {
            // if todo status is completed, set the isCompleted value to checked
            let isCompleted = todo.status == "completed" ? "checked" : "" ;
            if(filter == todo.status || filter == "all") {
                li += `<li class="task">
                <label for="${id}">
                    <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                    <p class="${isCompleted}">${todo.name}</p>
                </label>
                <span class="due__date">${todo.date}</span>
                <span class=""></span>
                <div class="settings">
                    <span onclick="showMenu(this)">...</span>
                    <ul class="task__menu">
                        <li onclick="editTask(${id}, '${todo.name}')"><i class="fa fa-pencil-square-o"></i>Edit</li>
                        <li onclick="deleteTask(${id})"><i class="fa fa-trash" aria-hidden="true"></i>Trash</li>
                    </ul>
                </div>
            </li>`;
            }
       });
    }
    // if li isn't empty, insert this value inside task box else insert span
    taskBox.innerHTML = li || `<span>You don't have any tasks here!</span>`;
}
showTodo("all");  

// show list menu 
function showMenu(selectedTask) {
    // getting task menu div
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add("show");
    document.addEventListener("click", e => {
         // removing show class from the task menu on the document click
         if(e.target != selectedTask) {
             taskMenu.classList.remove("show"); 
         }
     });
};


// edit task function
function editTask(taskId, taskName) {
    taskInput.value = taskName; //input field equals new task name
    isEditedTask = true;
    taskIdToEdit = taskId;
    taskNameToEdit = taskName;
}

// delete task function
function deleteTask(deleteId) {
    // removing selected task from array/todos
    todos.splice(deleteId, 1);
    localStorage.setItem("todo__list", JSON.stringify(todos));
    showTodo("all");
}

// shows calendar when clicking icon
function showCalendar() {
    document.addEventListener("click", e => {
        if(e.target = insertDate) {
        element.classList.add("show__date")
        } document.addEventListener("click", e => {
            if(e.target != insertDate)
            element.classList.remove("show__date")
        })
    } 
)}

// clear all function
clearAll.addEventListener("click", () => {
     // removing all task from array/todos
     todos.splice(0, todos.length);
     count = [],
     localStorage.setItem("todo__list", JSON.stringify(todos));
     showTodo("all");

})

// updating status based on 'checked' box
function updateStatus(selectedTask)  {
    // getting paragraph with task name
    let taskName = selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked) {
        taskName.classList.add("checked");
        // updating the status of selected task to completed
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        // updating the status of selected task to pending
        todos[selectedTask.id].status = "pending";
    } 
    localStorage.setItem("todo__list", JSON.stringify(todos));
}

// checking if task is due and alerting 

// enter feature 
taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    if(e.key == "Enter" && userTask ) {
        // alert(When Is This Task Due? 😁")
        element.classList.add("show__date");
    }
    
    document.addEventListener("click", () => {
        // removing show class from the task menu on the document click
        if(e.target !== insertDate) {
            element.classList.remove("show__date"); 
        }
    });
});

// set date feature 
insertDate.addEventListener("click", () => {
    if (dateSelect.value.length !== "") { // checking to see if .date__ wrapper input field is empty
        let userTask = taskInput.value.trim();
        let dueDate = dateSelect.value.trim();

        if (isEditedTask) {
            todos = JSON.parse(localStorage.getItem("todo__list"));
            todos = todos.map(f => {
                if (f.ID == taskIdToEdit) {
                    return {
                        ...f,
                        name: userTask,
                        date: dueDate
                    };
                }

                return f;
            });
            taskIdToEdit = null;
            taskNameToEdit = null;
            isEditedTask = false;
        } else {
            element.classList.remove("show__date"); // removing datepicker, if field is not empty after clicking button
            let taskInfo = {name: userTask, status: "pending", date: dueDate, ID: count++};
            todos.push(taskInfo); // adding new task to todos
        };   
    };
    element.classList.remove("show__date"); // removing datepicker, if field is not empty after clicking button
    dateSelect.value = "";
    taskInput.value = "";
    localStorage.setItem("todo__list", JSON.stringify(todos));
    showTodo("all") //displays new task inside the task menu once enter is keyed
});
