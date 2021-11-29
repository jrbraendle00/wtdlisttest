

//Get html elements
const listsElement = document.querySelector('#lists');
const listForm = document.querySelector('#list-form');
const listInput = document.querySelector('#list-input');
const deleteListBtn = document.querySelector('#delete-list-btn');
const tasksListElement = document.querySelector('#tasks-list');
const taskListTitle = document.querySelector('#list-name');
const tasksCounter = document.querySelector('#tasks-count');
const tasksElement = document.querySelector('#tasks');
const taskOutline = document.querySelector('#task-outline');
const taskForm = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const deleteTasksBtn = document.querySelector('#delete-tasks-btn')

//keys for local storage where we store our lists
const LIST_KEY = 'todo.lists'; 
const CURRENT_LIST_ID_KEY = 'task.currentListId';

//Get lists from local storage using key and convert to a js object or set to an empty array if there are no existing lists in local storage.
let lists = JSON.parse(localStorage.getItem(LIST_KEY)) || []; 

let currentListId = localStorage.getItem(CURRENT_LIST_ID_KEY);

var sql = require('mysql');

var config = sql.createPool({
    host: 'us-cdbr-east-04.cleardb.com',
    user: 'baeffcfa0361e8',
    password: 'd75d807f',
    database: 'heroku_f4a58d3b92ef321'
});

module.exports = config;

var sql = "select * from task_list";
config.query(sql, function(err, result) {
    if (err) throw err;
    console.log("record retrieved");
    res.send(result);
});

//Event Listeners

//highlight a list when it is clicked
listsElement.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') { //if the targeted element is an li element
        currentListId = e.target.dataset.listId;
        save();
        displayTasks();
    }
})

//if we click on a task checkbox set task status to true and update the task count
tasksElement.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') { //if the targeted element is an input element
        const currentList = lists.find(list => list.id === currentListId);
        const currentTask = currentList.tasks.find(task => task.id === e.target.id);
        currentTask.status = e.target.checked;
        save();
        getTaskCount(currentList);
    }
})

//Delete all completed tasks
deleteTasksBtn.addEventListener('click', e => {
    const currentList = lists.find(list => list.id === currentListId);
    currentList.tasks = currentList.tasks.filter(task => !task.status);
    save();
    displayTasks();
})

//Delete a list when delete list button is clicked
deleteListBtn.addEventListener('click', e => {
    lists = lists.filter(list => list.id !== currentListId); //Return a new list without the deleted list (the one that is currently selected)
    currentListId = null; //Set id to null since we no longer have a currently selected list
    save();
    displayTasks();
})

listForm.addEventListener('submit', e => {
    e.preventDefault(); //stop page from refreshing when we submit form
    const listName = listInput.value;
    
    //if list name is empty prompt user to enter one
    if (!listName) {
        alert("Please fill out the list name");
        return
    }

    //create a new list object and push it into our list storage
    const newList = new List(listName);
    listInput.value = null; //clears input box
    lists.push(newList);
    save();
    displayTasks();
})

taskForm.addEventListener('submit', e => {
    e.preventDefault(); //stop page from refreshing when we submit form
    const taskText = taskInput.value;
    
    if (!taskText) {
        alert("Please fill out task");
        return
    }

    //Create a new task object ans push it into the the currently selected list
    const newTask = new Task(taskText);
    taskInput.value = null;
    const currentList = lists.find(list => list.id === currentListId);
    currentList.tasks.push(newTask);
    save();
    displayTasks();
})

//List and Task Object Constructors
function List(name) {
    this.id = Date.now().toString();
    this.title = name;
    this.tasks = [];
}

function Task(text) {
    this.id = Date.now().toString();
    this.text = text;
    this.status = false;
}

//Functions

//Saves our lists into local storage so they don't disappear when page is refreshed
function save() {
    localStorage.setItem(LIST_KEY, JSON.stringify(lists)); //save list to local storage
    localStorage.setItem(CURRENT_LIST_ID_KEY, currentListId);
}

function displayTasks() { 
    clearElement(listsElement);
    addList();

    const currentList = lists.find(list => list.id === currentListId); 
    
    if (currentListId == null) { //If we don't have a list selected
        tasksListElement.style.display = 'none'; 
    } else { //display tasks element with current list info
        tasksListElement.style.display = ''; 
        taskListTitle.innerText = currentList.title;
        getTaskCount(currentList);
        clearElement(tasksElement);
        addTask(currentList);
    }
}

//Add tasks to a selected list
function addTask(currentList) { 
    currentList.tasks.forEach(task => { //for every task in the currently selected list
        const taskElement = document.importNode(taskOutline.content, true); //task element contains all of the information the html template has
        const checkbox = taskElement.querySelector('input');
        checkbox.id = task.id; 
        checkbox.checked = task.status; 
        const label = taskElement.querySelector('label');
        label.htmlFor = task.id; 
        label.append(task.text);
        tasksElement.appendChild(taskElement); //add new task element to the list of tasks
    })
}

//get the number of unfinished tasks
function getTaskCount (currentList) { 
    const unfinishedTasks = currentList.tasks.filter(task => !task.status).length; //get the length of the list of tasks that are not complete
    const taskText = unfinishedTasks === 1 ? "task" : "tasks";
    tasksCounter.innerText = `${unfinishedTasks} ${taskText} remaining`;
}

//Add a new list
function addList() {
    lists.forEach(list => {
        //create a list element of the form <li class="list-name">list title</li>
        const listElement = document.createElement('li');
        listElement.dataset.listId = list.id;
        listElement.classList.add("list-name");
        listElement.innerText = list.title;

        if (list.id === currentListId) {
            listElement.classList.add('active');
        }

        listsElement.appendChild(listElement); //add the new list to the list of lists
    })
}


//remove all the children of an element
function clearElement(element) {
    while(element.firstChild) { 
        element.removeChild(element.firstChild)
    }
}

displayTasks();