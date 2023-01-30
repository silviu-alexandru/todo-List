
import './style.css';
import storageAvailable from './checkStorage' //storageAvailable(type)
import { saveToStorage, getCategory, getId, closeForm} from './utils';
import { format, parseISO } from 'date-fns';

const {initialTodos} = require('./initialTodos');
localStorage.removeItem('todos');
let todos = JSON.parse(localStorage.getItem('todos'));

if (!todos) {
    todos = initialTodos;
    saveToStorage(todos);
}

const saveTodo = (e) =>{
    e.preventDefault();
    const data = new FormData(todoForm);
for (const iterator of data) {
    console.log(iterator);
}
    const newTodo = {
        title: '',
        category: '',
        details: '',
        dueDate: '',
        urgent: false,
        id: getId(12),
        done: false
    };
    console.log(data);
    for (const [name, value] of data) {
        if (name == 'urgent'){
            if (value == "on") {
                newTodo[name] = true;
            }
        }else if (name == 'id') {
            if ( value != '') {
                newTodo[name] = value;
            }
        }else {
            newTodo[name] = value;
        }
    }
    console.log(newTodo);
    let myIndex = todos.findIndex((element)=> element.id == newTodo.id);
    console.log(myIndex);
    if (myIndex >=0 ) {
        todos.splice(myIndex, 1, newTodo);
    }else {
        todos.push(newTodo);

    }
    renderTodos();
    closeForm();
    saveToStorage(todos);
}
const todoForm = document.getElementById('todoForm');
todoForm.addEventListener('submit', saveTodo);


const projects = document.querySelectorAll('.sb-option');
projects.forEach(element => {
    element.addEventListener('click', (e)=>{
        //category = e.target.textContent
        projects.forEach(project =>{
            project.classList.remove('selected');
        });
        e.target.classList.add('selected')
        renderTodos();
    });
});

const renderTodos = ()=>{
    console.log("rendring..");
    const mainView = document.getElementById('mainView');
    mainView.innerHTML = '';
    //const upperView = document.createElement('div');
    //upperView.id = 'upperView';
    const viewTitle = document.createElement('div');
    viewTitle.id = 'viewTitle';
    const category = getCategory();
    console.log(category); 
    viewTitle.textContent = category;
    mainView.appendChild(viewTitle);
    
    const newTodoBtn = document.createElement('button');
    newTodoBtn.id = 'newTodo';
    newTodoBtn.className = 'new-todo-btn btn';
    newTodoBtn.addEventListener('click', todoModal);
    //upperView.appendChild(newTodoBtn);
    mainView.appendChild(newTodoBtn);
    
    //mainView.appendChild(upperView);
    console.log(todos);
    todos.forEach(todo => {        
        if (todo.category == category) {
            
            const element = document.createElement('div');
            const elemClass = todo.done ? 'todo-elem done' : 'todo-elem';
            element.className = elemClass;
            element.id = todo.id;

            const innerShell = document.createElement('div');
            innerShell.classList.add('inner-shell');

            const todoIcon = document.createElement('div');
            const todoClass = todo.urgent ? 'todo-icon icon-flame' : 'todo-icon';
            todoIcon.className = todoClass;
            todoIcon.addEventListener('click', doneTodo);
            
            const todoTitle = document.createElement('div');
            todoTitle.classList.add('todo-title');
            todoTitle.textContent = todo.title;

            const todoDueDate = document.createElement('div');
            todoDueDate.classList.add('todo-dueDate');
            todoDueDate.textContent = format(parseISO(todo.dueDate), "dd-MM-yyyy");
            
            const todoMain = document.createElement('div');
            todoMain.classList.add('todo-main');
            todoMain.append(todoIcon, todoDueDate, todoTitle);
            
            const todoDetail = document.createElement('div');
            todoDetail.classList.add('todo-description');
            todoDetail.textContent = todo.details
            
            innerShell.append(todoMain, todoDetail)

            element.append(innerShell);

            element.addEventListener('click', showTodoButons)
            
            mainView.appendChild(element);
        }
    });
}

const showTodoButons = (e) => {
    //remove existing buttons; remove 'selected' class
    const remBtns = document.querySelectorAll('.todo-btns');
    remBtns.forEach(element => {  
        element.closest('.todo-elem').classList.remove('selected');
        element.remove();
    });

    const todoElem = e.target.closest('.todo-elem');

    const todoButtons = document.createElement('div');
    todoButtons.classList.add('todo-btns');
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn todo-btn btn';
    editBtn.addEventListener('click', editTodo);
    
    const delBtn = document.createElement('button');
    delBtn.className = 'del-btn todo-btn btn';
    delBtn.addEventListener('click', deleteTodo);
    //delBtn.textContent = 'DELETE';

    todoButtons.append(editBtn, delBtn);
    todoElem.appendChild(todoButtons);
    todoElem.classList.add('selected');
}
const editTodo = (e) => {
    e.stopPropagation();
    const todoElement = e.target.closest('.todo-elem');
    let myId = todoElement.id;
    console.log(myId);
    const arrayElem = todos.find(element => element.id == todoElement.id)
    console.log(arrayElem);
    todoModal(arrayElem);
}
const todoModal = (arrayElem) => {
    const todoFieldset = document.createElement('fieldset');
    todoFieldset.id = 'todoFieldset';
    const fieldsetTitle = document.createElement('h2');
    fieldsetTitle.innerText = 'Add / Edit ToDo'
    fieldsetTitle.id = 'fieldsetTitle';
    todoFieldset.appendChild(fieldsetTitle);
    //const todoCategory = document.createElement('div');

    const categorySelect = document.createElement('select')
    categorySelect.name = 'category';
    categorySelect.id = 'todoCategorySelect';
    categorySelect.className = 'fieldset-item';
    const projects = document.querySelectorAll('.sb-option');
    const category = arrayElem.category ? arrayElem.category : getCategory();
    projects.forEach(element => {
        console.log(element);
        const option = document.createElement('option');
        option.value = element.textContent;
        option.text = element.textContent;
        option.selected = '';
        if (element.textContent == category) {
            option.selected = 'selected'
        }
        categorySelect.appendChild(option);
    });
    todoFieldset.appendChild(categorySelect);

    //const todoPriority = document.createElement('div');
    const checkBoxDiv = document.createElement('div');
    checkBoxDiv.id = 'checkBoxDiv';

    const priorityCheck = document.createElement('input');
    priorityCheck.type = 'checkbox';
    priorityCheck.name = 'urgent';
    priorityCheck.id = 'priorityCheck';
    priorityCheck.className = 'fieldset-item'
    priorityCheck.checked = arrayElem.urgent;

    const priorityLabel = document.createElement('label');
    priorityLabel.htmlFor = 'priorityCheck';
    priorityLabel.className = 'fieldset-item fieldset-label'
    priorityLabel.appendChild(document.createTextNode('Urgent?'))
    checkBoxDiv
    checkBoxDiv.appendChild(priorityLabel);
    checkBoxDiv.appendChild(priorityCheck);

    todoFieldset.appendChild(checkBoxDiv);


    //const todoTitle = document.createElement('div')
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.name = 'title';
    titleInput.id = 'titleInput'
    titleInput.placeholder = 'ToDo Title';
    titleInput.className = 'fieldset-item';
    titleInput.required = true;
    titleInput.value = arrayElem.title ? arrayElem.title : '';
    todoFieldset.appendChild(titleInput);
    
    //due date
    const dueDateDiv = document.createElement('div');
    dueDateDiv.id = 'dueDateDiv';


    const dueDateInput = document.createElement('input');
    dueDateInput.type = 'date';
    dueDateInput.name = 'dueDate';
    dueDateInput.id = 'dueDate';
    dueDateInput.className = 'fieldset-item';
    const aDate = arrayElem.dueDate ? format(new Date(arrayElem.dueDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
    dueDateInput.value = aDate;
    const dueDateLabel = document.createElement('label');
    
    dueDateLabel.htmlFor = 'dueDate';
    dueDateLabel.className = 'fieldset-item fieldset-label';
    dueDateLabel.textContent = 'Due Date';
     
    dueDateDiv.appendChild(dueDateLabel);
    dueDateDiv.appendChild(dueDateInput);
    
    todoFieldset.appendChild(dueDateDiv);
  
    //const todoDetail= document.createElement('div');
    const detailInput = document.createElement('TEXTAREA');
    //detailInput.type = 'text';
    detailInput.rows = '2';
    detailInput.name = 'details';
    detailInput.id = 'detailInput'
    detailInput.placeholder = 'ToDo Detail';
    detailInput.className = 'fieldset-item';
    detailInput.value = arrayElem.details ? arrayElem.details : '';
    todoFieldset.appendChild(detailInput);

    const todoId = document.createElement('input');
    todoId.type = 'hidden'
    //todoId.type = 'text';
    todoId.name = 'id';
    console.log(arrayElem.id);
    todoId.value =  arrayElem.id ? arrayElem.id : null;

    todoFieldset.appendChild(todoId);

    const btnFormCancel = document.createElement('button');
    btnFormCancel.type = 'reset';
    btnFormCancel.classList = 'form-button btn';
    btnFormCancel.id = 'btnFormCancel';
    btnFormCancel.textContent = 'Cancel';
    btnFormCancel.addEventListener('click', closeForm);
    todoFieldset.appendChild(btnFormCancel);

    const btnFormSubmit = document.createElement('button');
    btnFormSubmit.type = 'submit';
    btnFormSubmit.classList = 'form-button btn';
    btnFormSubmit.id = 'btnFormSubmit';
    btnFormSubmit.textContent = 'Submit';
    todoFieldset.appendChild(btnFormSubmit);

    todoForm.appendChild(todoFieldset);
    document.querySelector('body').appendChild(todoForm);
    document.getElementById("todoForm").style.display = "block";
}

const deleteTodo = (e) => {
    e.stopPropagation();
    console.log(e.target);
    const todoElement = e.target.closest('.todo-elem');

    for (let i = 0; i < todos.length; i++) {
        if (todoElement.id == todos[i].id) {
            todos.splice(i, 1);
        }        
    }
    console.log(todos);
    renderTodos();
    saveToStorage(todos);
}
const doneTodo = (e) => {
    const todoElem = e.target.closest('.todo-elem');
    if (todoElem.classList.contains('selected')){

        e.stopPropagation();
    }
    todoElem.classList.toggle('done');

    for (let i = 0; i < todos.length; i++) {
        if ( todoElem.id == todos[i].id) {
            todos[i].done = !todos[i].done
        }        
    }
    saveToStorage(todos);   
}

renderTodos();
