const taskInput = document.getElementById('inputfield');
const taskList = document.getElementById('list-container');
document.getElementById("add-btn").addEventListener("click", newTask);

//when pressing enter, it adds a task
taskInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        newTask();
    }
});

//if the input is empty, it alerts 
function newTask() {
  if (taskInput.value == "") {
    alert("No task found.");
  } else if (taskInput.value.length < 5) {
    alert("Invalid Task");
  } else {
    let li = document.createElement("li");
    li.innerHTML = taskInput.value;
    
    let span = document.createElement("span");
    let trashIcon = document.createElement("i");
    trashIcon.className = "fa-solid fa-trash";
    span.appendChild(trashIcon);
    
    li.appendChild(span);
    taskList.appendChild(li);

    // toggle check if the task is done
    li.addEventListener("click", () => {
        li.classList.toggle("checked");
    });

    span.addEventListener("click", () => {
        li.remove();
        saveData();
    });
    
    taskInput.value = "";
    saveData();
  }

}

