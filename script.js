let taskInput=document.querySelector(".task-input input");
let taskBox=document.querySelector(".task-box")
let clearAll=document.querySelector(".clear-btn");


filters = document.querySelectorAll(".filters span"),

filters.forEach(btn=>{
    btn.addEventListener("click",()=>{
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});


let todos=JSON.parse(localStorage.getItem("todo-list"));

let isEditTask=false
let editId;

function showTodo(filter){
    let li="";
    if(todos){
        todos.forEach((todo,id)=>{
            //if todo status is completed ,set isCompleted
            let isCompleted=todo.status=="completed"?"checked":"";
            // console.log(id,todo);
            if(filter==todo.status || filter=="all"){
                li+=`
                    <li class="task">
                        <label for="${id}">
                            <input onClick="updateStatus(this)"  type="checkbox" id="${id}" ${isCompleted}/>
                            <p class="${isCompleted}">${todo.name}</p>
                        </label>
                        <div class="settings">
                            <i onClick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                            <ul class="task-menu">
                                <li onClick="editTask(${id},'${todo.name}' )" class="edit"><i class="uil uil-pen"></i>Edit</li>
                                <li onClick="deleteTask(${id})" class="delete"><i class="uil uil-trash"></i>Delete</li>
                            </ul>
                        </div>
                    </li>
                `;
            }
        });
    }
    taskBox.innerHTML=li || `<span>You dont have any task here</span>`;
}
showTodo("all");


function deleteTask(deleteId){
    todos.splice(deleteId,1);
    localStorage.setItem("todo-list",JSON.stringify(todos));
    showTodo("all");
}

function editTask(taskId,taskName){
    // console.log(taskId , taskName);
    editId = taskId;
    isEditTask = true;
    taskInput.value = taskName;
    taskInput.focus();
}



function showMenu(selectedTask){
    // console.log(selectedTask);
    //getting task menu div
    let taskMenu=selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add("show");
    document.addEventListener("click",e=>{
        if(e.target.tagName!='I' || e.target!=selectedTask){
            taskMenu.classList.remove("show");
        }
    })

}



function updateStatus(selectedTask){
    // console.log(selectedTask)
    let taskName=selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked){
        taskName.classList.add("checked");
        todos[selectedTask.id].status="completed";
    }else{
        taskName.classList.remove("checked");
        todos[selectedTask.id].status="pending";
    }
    localStorage.setItem("todo-list",JSON.stringify(todos));
}

clearAll.addEventListener("click", () => {
    isEditTask = false;
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
});


taskInput.addEventListener("keyup",e=>{
    let userTask=taskInput.value.trim();
    if(e.key=="Enter" && userTask){
        //gettng localStorage todo-list
        if(!isEditTask) {
            todos = !todos ? [] : todos;
            let taskInfo = {name: userTask, status: "pending"};
            todos.push(taskInfo);
        } else {
            isEditTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id);
    }
})