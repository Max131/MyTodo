'use strict';

let todoTasks =  [];

document.addEventListener('DOMContentLoaded', ev => {
    const todoList = document.querySelector('.todolist');
    const addButton = document.querySelector('.addButton');
    const addInput = document.querySelector('.addInput');
    const filterButtons = document.querySelector('.filter');

    const storeTodos = () => {
        !localStorage.getItem('MyTodos') && localStorage.setItem('MyTodos', '');
        localStorage.setItem('MyTodos', JSON.stringify(todoTasks));
    }

    const addTodo = ({id, content, completed, store = false}) => {
        store && todoTasks.push({id: id, content: content, completed: completed});
        storeTodos();
        const todo = document.createElement('li');
        const delButton = document.createElement('span');
        todo.dataset.id = id;
        todo.textContent = content;
        todo.classList.add('todo');
        !completed && todo.classList.add('todo--active')
        completed && todo.classList.add('todo--done');
        delButton.innerHTML = '&times;';
        delButton.classList.add('todo__delete');
        todo.insertAdjacentElement("beforeend",delButton);
        todoList.insertAdjacentElement("afterbegin", todo);
        
    };

    const newTodo = () => {
        if(addInput.value.trim()){
            const addNewTodo = {
                id: new Date().getTime(),
                content: addInput.value,
                completed: false,
                store: true
            };
            addTodo(addNewTodo);
        }
        addInput.value = '';
    }

    const loadTodos = () =>{
        if(localStorage.getItem('MyTodos')){
            todoTasks = JSON.parse(localStorage.getItem('MyTodos'));
            todoTasks.forEach( todo => {
                addTodo({...todo});
            });
        }
        else{
            const withoutTodo = {
                id: 0,
                content: 'Nothing here eh?, add your todos.',
                completed: false
            }
            addTodo({...withoutTodo, store: true});
        }
    };

    const getTodoIndex = (id) =>{
        const todoIndex = todoTasks.map(el => el.id).indexOf(+id);
        return todoIndex;
    };

    const toggleTodo = (todo) => {
        const index = getTodoIndex(todo.dataset.id);
        todoTasks[index].completed = !todoTasks[index].completed;
        todo.classList.toggle('todo--active');
        todo.classList.toggle('todo--done');
        storeTodos();
    };

    const deleteTodo = (todo) => {
        const index = getTodoIndex(todo.parentNode.dataset.id);
        console.log(index);
        todoTasks.splice(index, 1);
        storeTodos();
        todo.parentNode.remove();
    };

    const filterTodos = (filterParam) => {
        const allTodos = document.querySelectorAll('.todo');
        allTodos.forEach(todo => {
            todo.classList.contains(filterParam)? todo.classList.remove('hide'): todo.classList.add('hide');
        });
    };
    

    addInput.addEventListener('keypress', e => {
        e.keyCode === 13? newTodo(): '';
    });

    addButton.addEventListener('click', e => {
        newTodo();
    });

    todoList.addEventListener('click', e => {
        e.target.classList.contains('todo') && toggleTodo(e.target);
        e.target.classList.contains('todo__delete') && deleteTodo(e.target);
    });

    filterButtons.addEventListener('click', e => {
        const filter = e.target.dataset.filter;
        const oldButton = document.querySelector('.filter__button--active');
        oldButton.classList.remove('filter__button--active');
        e.target.classList.toggle('filter__button--active');
        filterTodos(filter);
    });

    loadTodos();
});