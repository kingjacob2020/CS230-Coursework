const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const pauseButton = document.getElementById("pause");

//declaring variables to start, stop and pause timer
let timeLeft = 60;
let timerInterval = null;
let isPaused = false;

//function to show the timer the warning at 15 seconds
function show(){
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    timerDisplay.textContent=
        (minutes < 10 ? "0" : "") + minutes + ":" +
        (seconds < 10 ? "0" : "") + seconds;

        if (timeLeft <= 15) timerDisplay.classList.add("warning");
        else timerDisplay.classList.remove("warning");
}


//start button
startButton.onclick = () => {
    startButton.disabled = true;
    stopButton.disabled = false;
    pauseButton.disabled = false;
    isPaused = false;

//starts and makes the timer work
//decreases the timer every second
timerInterval = setInterval(() => {
    timeLeft--;
    show();
    //when timer reaches 0 stops and resets
    if (timeLeft === 0){
        clearInterval(timerInterval);
        alert("Take a short break!");
        timeLeft = 60;
        show();

        startButton.disabled = false;
        stopButton.disabled = true;
        pauseButton.disabled = true;
        pauseButton.textContent = "Pause";
    }
    }, 1000);
};

//stops the timer and resets it
stopButton.onclick = () => {
    clearInterval(timerInterval);

    //resets the timer back to 60 seconds
    timeLeft = 60;
    show();

    startButton.disabled = false;
    stopButton.disabled = true;
    pauseButton.disabled = true;
    pauseButton.textContent = "Pause";
    isPaused = false;
};



//pauses and resumes the timer
pauseButton.onclick = () => {
    if (!isPaused) {
        clearInterval(timerInterval);
        pauseButton.textContent = "Resume";
        isPaused = true;
    }

    //resumes the timer
    else {
        timerInterval = setInterval(() => {
            timeLeft--;
            show();

            if (timeLeft === 0){
                clearInterval(timerInterval);
                alert("Take a short break!");
                timeLeft = 60;
                show();

                startButton.disabled = false;
                stopButton.disabled = true;
                pauseButton.disabled = true;
                pauseButton.textContent = "Pause";
            }
    }, 1000);
        pauseButton.textContent = "Pause";
        isPaused = false;
    }
};


//displays the timer when page is loaded
show();