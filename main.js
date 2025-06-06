// script.js

let timerInterval;
let isRunning = false;
let elapsedTime = 0; // in milliseconds
let lapTimes = [];

const startStopBtn = document.getElementById('startStopBtn');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const hoursDisplay = document.getElementById('hours');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const millisecondsDisplay = document.getElementById('milliseconds');
const lapList = document.getElementById('lapList');

// Format milliseconds into hh:mm:ss:ms
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  const milliseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, '0'); // two digits
  return { hours, minutes, seconds, milliseconds };
}

// Update the visible timer display
function updateDisplay() {
  const { hours, minutes, seconds, milliseconds } = formatTime(elapsedTime);
  hoursDisplay.textContent = hours;
  minutesDisplay.textContent = minutes;
  secondsDisplay.textContent = seconds;
  millisecondsDisplay.textContent = milliseconds;
}

// Start or stop the stopwatch
function startStopwatch() {
  if (!isRunning) {
    isRunning = true;
    startStopBtn.textContent = 'Stop';
    startStopBtn.classList.remove('btn-start');
    startStopBtn.classList.add('btn-stop');
    lapBtn.disabled = false;

    const startTime = Date.now() - elapsedTime;

    timerInterval = setInterval(() => {
      elapsedTime = Date.now() - startTime;
      updateDisplay();
    }, 10);
  } else {
    isRunning = false;
    startStopBtn.textContent = 'Start';
    startStopBtn.classList.remove('btn-stop');
    startStopBtn.classList.add('btn-start');
    lapBtn.disabled = true;
    clearInterval(timerInterval);
  }
}

// Record the current lap time
function recordLap() {
  if (isRunning) {
    lapTimes.push(elapsedTime);
    renderLaps();
  }
}

// Render lap times in the list
function renderLaps() {
  lapList.innerHTML = '';
  if (lapTimes.length === 0) {
    lapList.innerHTML = '<div class="no-laps">No lap times recorded</div>';
    return;
  }

  // Calculate fastest and slowest laps
  let minTime = Math.min(...lapTimes);
  let maxTime = Math.max(...lapTimes);

  lapTimes.forEach((time, index) => {
    const lapItem = document.createElement('div');
    lapItem.classList.add('lap-item');
    if (time === minTime) lapItem.classList.add('fastest');
    if (time === maxTime) lapItem.classList.add('slowest');
    const formatted = formatTime(time);

    lapItem.innerHTML = `
      <span class="lap-number">Lap ${index + 1}</span>
      <span class="lap-time">${formatted.hours}:${formatted.minutes}:${formatted.seconds}:${formatted.milliseconds}</span>
    `;
    lapList.appendChild(lapItem);
  });
}

// Reset stopwatch and clear laps
function resetStopwatch() {
  clearInterval(timerInterval);
  isRunning = false;
  elapsedTime = 0;
  lapTimes = [];
  updateDisplay();
  lapList.innerHTML = '<div class="no-laps">No lap times recorded</div>';
  startStopBtn.textContent = 'Start';
  startStopBtn.classList.remove('btn-stop');
  startStopBtn.classList.add('btn-start');
  lapBtn.disabled = true;
}

// Attach event listeners
startStopBtn.addEventListener('click', startStopwatch);
lapBtn.addEventListener('click', recordLap);
resetBtn.addEventListener('click', resetStopwatch);

// Initialize display and state
updateDisplay();
lapBtn.disabled = true;
