// Get references to DOM elements
const taskInput = document.getElementById('inputfield');
const dateInput = document.getElementById('calendar');
const timeInput = document.getElementById('time');
const taskList = document.getElementById('list-container');
const addButton = document.getElementById('add-btn');
const expiredList = document.getElementById('expired-container');

// Function to save tasks to localStorage
function saveData() {
  localStorage.setItem('data', taskList.innerHTML);
  localStorage.setItem('expiredData', expiredList.innerHTML);  // Save expired tasks
}

// Function to sort tasks by deadline
function sortTasks() {
  const tasksArray = Array.from(taskList.getElementsByTagName('li'));
  
  tasksArray.sort((a, b) => {
    const deadlineA = a.getAttribute('data-deadline');
    const deadlineB = b.getAttribute('data-deadline');
    return Number(deadlineA) - Number(deadlineB);
  });

  tasksArray.forEach(task => taskList.appendChild(task));
}

// Function to move expired tasks to the expired container
function moveToExpired(task) {
  taskList.removeChild(task);  // Remove from the task list
  expiredList.appendChild(task);  // Add to the expired list
  saveData();
}

// Function to add a new task
function newTask() {
  const taskText = taskInput.value.trim();  // Get the task text
  const date = dateInput.value;
  const time = timeInput.value;

  // Validation of task input and deadline
  if (taskText === "") {
    alert("No task found.");
  } else if (taskText.length < 5) {
    alert("Task description should be at least 5 characters.");
  } else if (date === "" || time === "") {
    alert("Please select both date and time for the deadline.");
  } else {
    // Create a new task with the deadline
    let li = document.createElement("li");
    let deadline = new Date(`${date}T${time}`);
    
    li.innerHTML = `<strong>${taskText}</strong> <span>${date} | ${time}</span>`;
    
    // Create and add the trash icon
    let trashIcon = document.createElement("i");
    trashIcon.className = "fa-solid fa-trash";
    li.appendChild(trashIcon);

    taskList.appendChild(li);
    
    // Add deadline timestamp to the task (for comparison)
    li.setAttribute('data-deadline', deadline.getTime());
    
    // Toggle task done
    li.addEventListener("click", () => {
      li.classList.toggle("checked");
      saveData();
    });

    // Remove task when trash icon is clicked
    trashIcon.addEventListener("click", (e) => {
      e.stopPropagation();  // Prevent the click event from bubbling up to the list item
      li.remove();
      saveData();
    });

    // Clear the input fields
    taskInput.value = "";
    dateInput.value = "";
    timeInput.value = "";
    saveData();

    // Periodically check if the task is expired
    setInterval(() => {
      const now = new Date();
      if (deadline.getTime() < now.getTime()) {
        moveToExpired(li);  // Move task to expired container if deadline has passed
      }
    }, 60000);  // Check every minute

    // Sort the tasks after adding a new one
    sortTasks();
  }
}

// Function to check for expired tasks on page load
function checkForExpiredTasks() {
  const now = new Date();

  taskList.querySelectorAll("li").forEach((li) => {
    const deadline = li.getAttribute('data-deadline');
    if (deadline && Number(deadline) < now.getTime()) {
      moveToExpired(li);
    }
  });
}

// Event listener for the Add button
addButton.addEventListener('click', newTask);

// Event listener for Enter key press
document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    newTask();
  }
});

// Load tasks from localStorage and add necessary event listeners
if (localStorage.getItem("data")) {
  taskList.innerHTML = localStorage.getItem("data");

  taskList.querySelectorAll("li").forEach((li) => {
    const deadline = li.getAttribute('data-deadline');

    // Reapply click event to mark task as done
    li.addEventListener("click", () => {
      li.classList.toggle("checked");
      saveData();
    });

    // Add trash icon functionality
    li.querySelector(".fa-trash").addEventListener("click", (e) => {
      e.stopPropagation();  // Prevent the click event from bubbling up to the list item
      li.remove();
      saveData();
    });
  });

  // Check for expired tasks on load
  checkForExpiredTasks();

  // Sort the tasks when loading from localStorage
  sortTasks();
}

// Load expired tasks from localStorage
if (localStorage.getItem("expiredData")) {
  expiredList.innerHTML = localStorage.getItem("expiredData");
  
}
