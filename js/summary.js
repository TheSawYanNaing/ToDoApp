// Selecting DOM
const menuIcon = document.querySelector(".menu-icon");
const menuBar = document.querySelector(".menu-bar");

// Toggling menuBar when menuIcon is clicked
menuIcon.addEventListener("click", function()
{
    // if show hide else show
    if (getComputedStyle(menuBar).width === "0px")
    {
        menuBar.style.width = "200px";
    }

    else 
    {
        menuBar.style.width = "0px";
    }
})

document.addEventListener("DOMContentLoaded", function()
{
    // Getting tasks from local storage
    const tasks = JSON.parse(localStorage.getItem("tasks"))

    // Selecting DOM
    const taskContainer = this.querySelector(".task-container");

    if (!tasks)
    {
        taskContainer.textContent = "Nothing Here for now";
        return;
    }

    // Get the total number of tasks
    const total = tasks.length;

    // Get the total number of fail tasks
    const fail = tasks.filter((task) => task.status === "fail").length;

    // Get the total number of success tasks
    const success = tasks.filter((task) => task.status === "success").length;

    // Get the success rate
    const successRate = Math.floor(success / total * 100, 2);

    // Creating div for those
    addSummary("Total", total);
    addSummary("Fail", fail);
    addSummary("Success", success);
    addSummary("Success Rate", `${successRate}%`)
})

// For Adding Summary
function addSummary(text, num)
{
    // Creating a div
    const div = document.createElement("div");

    div.className = `summary flexcol-container flexcol-center ${text}`;

    div.innerHTML = `
        <h2>${text}</h2>
        <span>${num}</span>
    `;

    document.querySelector(".task-container").append(div);
}