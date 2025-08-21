// Getting tasks from local storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, 0);
const day = String(today.getDate()).padStart(2, 0);

const todayStr = `${year}-${month}-${day}`;

document.addEventListener("DOMContentLoaded", function()
{
    // Selecting DOM
    const addTaskBtn = this.querySelector(".adding");
    const addForm = this.querySelector(".adding-form");
    const discardBtn = this.querySelector(".discard-btn");
    const form = this.querySelector("#form");
    const select = this.querySelector("select");
    const taskContainer = this.querySelector(".task-container");
    const navigation = this.querySelector(".navigation");
    const menuIcon = this.querySelector(".menu-icon");
    const menuBar = this.querySelector(".menu-bar");

    // If tasks is not empty
    if (tasks.length > 0)
    {
        makeSelection(tasks);

        // Getting all the tasks for today
        const todayTasks = tasks.filter(function(task){
            return task.date === todayStr
        })

        // Check todayTasks exist
        if (todayTasks.length > 0)
        {
            // Create tasks 
            for (const task of todayTasks)
            {
                const div = getTask(task);

                taskContainer.append(div);
            }
        }

        else 
        {
            taskContainer.textContent = "No Task For Today";
        }
    }

    else
    {
        taskContainer.textContent = "No Task For Today";
    }


    // Event Listener
    // showing addForm when addTaskBtn is clicked
    addTaskBtn.addEventListener("click", function(event)
    {
        // Stop event from bubbling up
        event.stopPropagation();

        // Setting display block to addForm
        addForm.style.display = "block";
    })

    // Hiding addForm when document is clicked
    this.addEventListener("click", function()
    {
        addForm.style.display = "none";
    })

    // Making sure addForm doesn't disappear when clicking 
    addForm.addEventListener("click", function(event)
    {
        event.stopPropagation();
    })

    // Handling form submit
    form.addEventListener("submit", function(event)
    {
        // Stoping default form submit behavior
        event.preventDefault();

        // Getting form data
        const data = new FormData(this);
        const title = data.get("title");
        const description = data.get("description");
        const date = data.get("date");

        // Making sure that title and date is not empty
        if (!title.trim())
        {
            this.querySelector(".title-error").textContent = "Missing Title";
            return;
        }

        if (!date.trim())
        {
            this.querySelector(".date-error").textContent = "Missing Date";
            return;
        }

        // Create an object with provided data
        const obj = {
            title,
            description,
            date,
            "status" : "pending"
        };

        // Updating tasks
        tasks = [...tasks, obj];

        // Changint Selection
        makeSelection(tasks);

        // Storing back to local storage
        localStorage.setItem("tasks", JSON.stringify(tasks));

        // Clear input value
        this.querySelector("#title").value = "";
        this.querySelector("#description").value = "";
        this.querySelector("#date").value = "";

        // Show success message around 2seconds
        document.querySelector("p.success").textContent = "Task Added Successfully";

        // Removing success message after 2 seconds
        setTimeout(function()
        {
            document.querySelector("p.success").textContent = "";
        }, 2000);

        // Check is it the task for today
        if (date == navigation.textContent)
        {
            const div = getTask({title, description, date, status : "pending"})
            taskContainer.append(div);
        }

    })

    // Making adding form disappear when dicardBtn is clicked
    discardBtn.addEventListener("click", function()
    {
        addForm.style.display = "none";
    })

    // Adding event on select
    select.addEventListener("change", function()
    {
        // Getting the change value
        let date = this.value;
        
        navigation.textContent = date;

        if (date === "Today")
        {
            date = todayStr;
        }

        // Getting all the task for that date
        const filterTasks = tasks.filter((task) => task.date === date)

        // Removing previous task
        taskContainer.innerHTML = "";

        // Getting div for those tasks
        for (const task of filterTasks)
        {
            const div = getTask(task);

            taskContainer.append(div);
        }
    })

    // Toggling display of menu bar on the click of menu icon
    menuIcon.addEventListener("click", function()
    {
        if (getComputedStyle(menuBar).width === "0px")
        {
            menuBar.style.width = "200px";
        }

        else 
        {
            menuBar.style.width = "0px";
        }
    })
})  


// For Getting Task to display
function getTask({title, description, date, status})
{
    // Create a div
    const div = document.createElement("div");

    div.className = `task flexrow-container ${status}`;

    div.innerHTML = `
        <div>
            <h4>${title}</h4>
            <p>${description}</p>
        </div>
    `;

    // Checking status
    if (status == "pending")
    {
        // Creating another div
        const div2 = document.createElement("div");
        div2.className = "more";
        div2.innerHTML = `
            <i class="fa-solid fa-ellipsis-vertical"></i>
            <div class="button-container">
                <button class="primary-btn">Completed</button>
                <button class="fail-btn">Fail</button>
            </div>
        `

        // Selecing dom
        const buttonContainer = div2.querySelector(".button-container");
        const completeBtn = div2.querySelector(".primary-btn");
        const failBtn = div2.querySelector(".fail-btn");
        
        // Toggling display of button container when more is clicked
        div2.addEventListener("click", function()
        {
            if (getComputedStyle(buttonContainer).display === "none")
            {
                buttonContainer.style.display = "flex";
            }

            else 
            {
                buttonContainer.style.display = "none";
            }
        })

        // Marking the task as complete if completeBtn is clicked
        completeBtn.addEventListener("click", function()
        {   
            
            // Removing div2
            div2.remove();

            // Changing the classname of div
            div.className = "task flexrow-container success"

            // Changing in local storage
            tasks = tasks.map(function(task)
            {
                if (task.title === title && task.description === description && task.date === date)
                {
                    return {...task, status : "success"}
                }

                return task
            })

            localStorage.setItem("tasks", JSON.stringify(tasks))
        })

        // Marking the task as fail if failBtn is clicked
        failBtn.addEventListener("click", function()
        {
            div2.remove();

            // Changing the classname of div
            div.className = "task flexrow-container fail"

            // Changing in local storage
            tasks = tasks.map(function(task)
            {
                if (task.title === title && task.description === description && task.date === date)
                {
                    return {...task, status : "fail"}
                }

                return task
            })

            localStorage.setItem("tasks", JSON.stringify(tasks))
        })

        div.append(div2);
    }

    return div;
}

// For making selection
function makeSelection(tasks)
{
    const select = document.querySelector("select");

    select.innerHTML = `<option selected disabled>Choose Date</option>`;

    // Getting all the date from the tasks 
    let dates = tasks.map(function(task)
    {
        if (task.date === todayStr)
        {
            return "Today";
        }
        
        return task.date;
    });

    dates = new Set(dates.reverse())

    // Creating option for select
    for (const date of dates)
    {
        const option = document.createElement("option")
        option.value = date 
        option.textContent = date 

        select.append(option);
    }
}