const taskInput = document.getElementById('inputfield');
const dateInput = document.getElementById('calendar');
const timeInput = document.getElementById('time');
const taskList = document.getElementById('list-container');
const addButton = document.getElementById('add-btn');
const expiredList = document.getElementById('expired-container');

function saveData() {
  localStorage.setItem('data', taskList.innerHTML);
  localStorage.setItem('expiredData', expiredList.innerHTML); 
}

function sortTasks() {
  const tasksArray = Array.from(taskList.getElementsByTagName('li'));
  
  tasksArray.sort((a, b) => {
    const deadlineA = a.getAttribute('data-deadline');
    const deadlineB = b.getAttribute('data-deadline');
    return Number(deadlineA) - Number(deadlineB);
  });

  tasksArray.forEach(task => taskList.appendChild(task));
}

function moveToExpired(task) {
  taskList.removeChild(task);  
  expiredList.appendChild(task);  

  addDeleteExpiredTaskEvent(task);

  saveData();
}

function addDeleteExpiredTaskEvent(task) {
  const trashIcon = task.querySelector('.fa-trash');
  if (trashIcon) {
    trashIcon.addEventListener("click", (e) => {
      e.stopPropagation();  
      task.remove();
      saveData();
    });
  }
}

function newTask() {
  const taskText = taskInput.value.trim();  
  const date = dateInput.value;
  const time = timeInput.value;

  if (taskText === "") {
    alert("No task found.");
  } else if (taskText.length < 5) {
    alert("Task description should be at least 5 characters.");
  } else if (date === "" || time === "") {
    alert("Please select both date and time for the deadline.");
  } else {
    let li = document.createElement("li");
    let deadline = new Date(`${date}T${time}`);
    
    li.innerHTML = `<strong>${taskText}</strong> <span>${date} | ${time}</span>`;
    
    let trashIcon = document.createElement("i");
    trashIcon.className = "fa-solid fa-trash";
    li.appendChild(trashIcon);

    taskList.appendChild(li);
    
    li.setAttribute('data-deadline', deadline.getTime());
    
    li.addEventListener("click", () => {
      li.classList.toggle("checked");
      saveData();
    });

    trashIcon.addEventListener("click", (e) => {
      e.stopPropagation();  
      li.remove();
      saveData();
    });

    taskInput.value = "";
    dateInput.value = "";
    timeInput.value = "";
    saveData();

    setInterval(() => {
      const now = new Date();
      if (deadline.getTime() < now.getTime()) {
        moveToExpired(li);  
      }
    }, 60000);  

    sortTasks();
  }
}

function checkForExpiredTasks() {
  const now = new Date();

  taskList.querySelectorAll("li").forEach((li) => {
    const deadline = li.getAttribute('data-deadline');
    if (deadline && Number(deadline) < now.getTime()) {
      moveToExpired(li);
    }
  });
}

function loadExpiredTasks() {
  if (localStorage.getItem("expiredData")) {
    expiredList.innerHTML = localStorage.getItem("expiredData");
    
    expiredList.querySelectorAll("li").forEach((li) => {
      addDeleteExpiredTaskEvent(li);  
    });
  }
}

addButton.addEventListener('click', newTask);

document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    newTask();
  }
});

if (localStorage.getItem("data")) {
  taskList.innerHTML = localStorage.getItem("data");

  taskList.querySelectorAll("li").forEach((li) => {
    const deadline = li.getAttribute('data-deadline');

    li.addEventListener("click", () => {
      li.classList.toggle("checked");
      saveData();
    });

    li.querySelector(".fa-trash").addEventListener("click", (e) => {
      e.stopPropagation();  
      li.remove();
      saveData();
    });
  });

  checkForExpiredTasks();

  sortTasks();
}

loadExpiredTasks();
