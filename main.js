document.addEventListener("DOMContentLoaded", () => {
 
    function toDoForm(form, list) {
        const KEY = 'tasks';

        function setToLocalStorage (taskData) {
            const currentTasks = localStorage.getItem(KEY);

            if (currentTasks === null) {
                localStorage.setItem(KEY, JSON.stringify([taskData]));
            } else {
                const tasks = JSON.parse(currentTasks);
                tasks.push(taskData);
                localStorage.setItem(KEY, JSON.stringify(tasks));
            }
        }

        function getFromLocalStorage() {
            const tasks = JSON.parse(localStorage.getItem(KEY));

            if (tasks !== null) {
                tasks.forEach(setTasks);
            }
        }

        function setTasks (taskData) {
            const {value, id, isCompleted} = taskData;
            list.insertAdjacentHTML('beforeend',
                `<li class="todo-item" id="${id}">
                           <input type="checkbox">
                           <span class="todo-item__description">${value}</span>
                           <button class="todo-item__delete">Видалити</button>
                       </li>`);

            const taskElement = document.getElementById(id);
            addDeletionListener(taskElement.querySelector('.todo-item__delete'), id);
            addCompletionListener(taskElement.querySelector('[type="checkbox"]'), id);
        }

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const taskData = {
                value: form.elements.value.value,
                id: Math.floor(Math.random() * 100),
                isCompleted: false
            }

            setTasks(taskData);
            setToLocalStorage(taskData);
            form.reset();
        });

        function addDeletionListener (deleteBtn, taskId) {
            deleteBtn.addEventListener('click', (event) => {
                event.target.parentElement.remove();

                const tasks = JSON.parse(localStorage.getItem(KEY));
                const newTasks = tasks.filter( (item) => {
                    return item.id !== taskId;
                });
                localStorage.setItem(KEY, JSON.stringify(newTasks));
            })
        }

        function addCompletionListener (checkbox, taskId) {
            checkbox.addEventListener('click', (event) => {
                const currentElement = event.target;
                const tasks = JSON.parse(localStorage.getItem(KEY));

                let currentTaskIndex = tasks.findIndex((task) => {
                   return task.id === taskId;
                })

                if ( tasks[currentTaskIndex].isCompleted === true) {
                    currentElement.parentElement.style.textDecoration = 'none';
                } else {
                    currentElement.parentElement.style.textDecoration = 'line-through';
                }

                tasks[currentTaskIndex].isCompleted = !tasks[currentTaskIndex].isCompleted;
                localStorage.setItem(KEY, JSON.stringify(tasks));
            })
        }
        getFromLocalStorage();
    }

    toDoForm(
        document.querySelector('.js--form'),
        document.querySelector('.js--todos-wrapper')
    )
})