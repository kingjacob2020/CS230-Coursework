document.getElementById('welcome-message').innerHTML = "Welcome, Jacob!";

let count = 0;

document.getElementById('add-session').onclick = function() {
    count++;
    document.getElementById('session-count').innerHTML = count;
};

document.getElementById('reset-session').onclick = function() {
    count = 0;
    document.getElementById('session-count').innerHTML = count;
};

const goals = ["Read notes", "Finish lab", "Practice JavaScript"];

for (let i = 0; i < goals.length; i++) {
    console.log(goals[i]);
}

document.getElementById('show-goals-button').onclick = function() {
    let html = "<ul>";
    for (let i = 0; i < goals.length; i++) {
        html += "<li>" + goals[i] + "</li>";
    }
    html += "</ul>";
    document.getElementById('dynamic-goals').innerHTML = html;
};

const hoursStudied = 3;

if (hoursStudied >= 3) {
    console.log("Good progress");
} else {
    console.log("You should study more");
}