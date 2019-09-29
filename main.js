document.querySelector("input").addEventListener("focus", e =>{
    document.querySelector(".plusSign").style.display = "none";
    document.querySelector(".addCircle").style.display = "block";
})
document.querySelector("input").addEventListener("blur", e =>{
    document.querySelector(".plusSign").style.display = "block";
    document.querySelector(".addCircle").style.display = "none";
})


const Task = {
    task: "",
    status: "",
    id: "",
    priority: "",
    date: ""
}
taskArr = [];

function init() {
    getPosts();
    setEventListeners();
}


function getPosts() {
    fetch("https://todolist-245e.restdb.io/rest/todo", {
            method: "get",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "x-apikey": "5d8c72e80e26877dd0577b4d",
                "cache-control": "no-cache"
            }
        })
        .then(e => e.json())
        .then(e => createObjects(e));
}



function appendTasks(taskArr) {
    const taskTemplate = document.querySelector(".template-task").content;
    const taskWrapper = document.querySelector(".listings");
    taskWrapper.innerHTML = "";
    
    taskArr.forEach(task => {
    let clone = taskTemplate.cloneNode(true);
    clone.querySelector(".delete").id = task._id;
    if (task.status == "done") {
        clone.querySelector(".check-container input").checked = true;
    }
    clone.querySelector(".listing-text").textContent = task.task;
    clone.querySelector(".check-container").addEventListener("click", () => {
        updateStatus(task)
    })
    taskWrapper.appendChild(clone);
    
    });
    document.querySelectorAll(".delete").forEach( button => {
        button.addEventListener("click", e => {
            removeTask(e,taskArr)
        })
    });
    
}

function updateStatus(task) {
    task.status = "done";
    updatePost(task);

}

function setEventListeners() {
    const form = document.querySelector("form");
    form.addEventListener("submit", e => {
        addTask(form);
        form.elements.task.value = "";
        e.preventDefault();
    });
}

function removeTask(e,taskArr) {
   let taskId = e.target.id;
    
    let deleteLink = "https://todolist-245e.restdb.io/rest/todo/" + taskId;
    fetch(deleteLink, {
        method: "delete",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "x-apikey": "5d8c72e80e26877dd0577b4d",
            "cache-control": "no-cache"
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log("data was deleted", data);
        });
    
    let removedTask = taskArr.find(e => {
        return e._id == taskId
      })
    
    
    let indexOfRemovedTask = taskArr.indexOf(removedTask);
    console.log(removedTask);
    taskArr.splice(indexOfRemovedTask, 1);
   appendTasks(taskArr);  
    
}

function addTask(form) {
    const task = Object.create(Task);

    task.task = form.elements.task.value;
    task.status = "pending";

    postToDB(task);
    taskArr = [];
    getPosts();
}

function postToDB(data) {
    const postData = JSON.stringify(data);
    fetch("https://todolist-245e.restdb.io/rest/todo", {
            method: "post",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "x-apikey": "5d8c72e80e26877dd0577b4d",
                "cache-control": "no-cache"
            },
            body: postData
        })
        .then(res => res.json());

}

function updatePost(task) {


    let postData = JSON.stringify(task);

    let url = "https://todolist-245e.restdb.io/rest/todo/" + task._id;
    fetch(url, {
        method: "put",
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'x-apikey': "5d8c72e80e26877dd0577b4d",
            "cache-control": "no-cache"
        },
        body: postData
    }).then(d => d.json()).then(t => console.log(t));
}


function createObjects(data) {
    data.forEach(data => {
        const task = Object.create(Task);

        // BASIC POPULATION OF OBJECT
        task.task = data.task;
        task.status = data.status;
        task._id = data._id;
        //PUSH TO ARRAY
        taskArr.push(task);

        //append
    });
    appendTasks(taskArr);

}




init();
