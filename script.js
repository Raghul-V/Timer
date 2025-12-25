document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const minutesInput = document.getElementById('minutes');
    const secondsInput = document.getElementById('seconds');
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    const timeDisplay = document.getElementById('timeDisplay');
    const light = document.getElementById('light');

    let timer;
    let totalSeconds = 0;
    let isRunning = false;

    // Initialize with default time (5 minutes)
    updateTimeDisplay(300);
    updateDisplay();

    // Event Listeners
    startBtn.addEventListener('click', toggleTimer);
    resetBtn.addEventListener('click', resetTimer);

    // Format time values to always show two digits
    function formatTime(value) {
        return value.toString().padStart(2, '0');
    }
    
    // Update the display to show current time values
    function updateDisplay() {
        const minutes = formatTime(minutesInput.value);
        const seconds = formatTime(secondsInput.value);
        timeDisplay.textContent = `${minutes}:${seconds}`;
    }
    
    // Validate input and update display
    function handleInput(input) {
        // Ensure value is within bounds
        let value = parseInt(input.value) || 0;
        const max = input === minutesInput ? 90 : 59;
        
        if (value > max) value = max;
        if (value < 0) value = 0;
        
        input.value = value === 0 ? '00' : value.toString();
        updateDisplay();
    }
    
    // Input event listeners
    [minutesInput, secondsInput].forEach(input => {
        input.addEventListener('input', () => handleInput(input));
    });
    
    // Initial display update
    updateDisplay();

    function toggleTimer() {
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    }

    function startTimer() {
        // If already running, do nothing (handled by pauseTimer)
        if (isRunning) {
            pauseTimer();
            return;
        }

        // Only set new time if not resuming
        if (!totalSeconds || totalSeconds <= 0 || startBtn.classList.contains("btn-start")) {
            const minutes = parseInt(minutesInput.value) || 0;
            const seconds = parseInt(secondsInput.value) || 0;
            totalSeconds = minutes * 60 + seconds;

            if (totalSeconds <= 0) {
                alert('Please enter a valid time');
                return;
            }
        }

        isRunning = true;
        startBtn.className = 'btn btn-pause';
        
        // Disable input fields while running
        minutesInput.disabled = true;
        secondsInput.disabled = true;

        timer = setInterval(updateTimer, 1000);
    }

    function pauseTimer() {
        clearInterval(timer);
        isRunning = false;
        startBtn.className = 'btn btn-resume';
        // Keep the current totalSeconds value for resuming
    }

    function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        
        // Reset to initial values
        const minutes = parseInt(minutesInput.value) || 0;
        const seconds = parseInt(secondsInput.value) || 0;
        totalSeconds = minutes * 60 + seconds;
        
        updateTimeDisplay(totalSeconds);
        startBtn.className = 'btn btn-start';
        
        // Enable input fields
        minutesInput.disabled = false;
        secondsInput.disabled = false;
        
        // Reset light to default (white with black border)
        light.className = 'light';
        
        // Clear any existing timer
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    function timerComplete() {
        isRunning = false;
        startBtn.className = 'btn btn-start';
        minutesInput.disabled = false;
        secondsInput.disabled = false;
        
        // Update light to red when time's up
        updateLights();
        
        // Play sound (optional)
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2863/2863-preview.mp3');
        // On mobile, audio must be triggered by user interaction
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(e => console.log('Audio play failed:', e));
        }
    }

    function updateTimeDisplay(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timeDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function updateLights() {
        // Don't update lights if timer is not running
        if (!isRunning && totalSeconds > 0) return;
        
        // Remove all color classes
        light.className = 'light';
        
        // Green light: All time except last 30 seconds
        // Yellow light: Last 30 seconds
        // Red light: When time is up (handled in timerComplete)
        if (totalSeconds > 30) {
            light.classList.add('green');
        } else if (totalSeconds > 0) {
            light.classList.add('yellow');
        } else {
            light.classList.add('red');
        }
    }

    function updateTimer() {
        if (totalSeconds <= 0) {
            clearInterval(timer);
            return;
        }
        
        totalSeconds--;
        updateTimeDisplay(totalSeconds);
        updateLights();
        
        // Update button text based on remaining time
        if (totalSeconds <= 0) {
            startBtn.className = 'btn btn-start';
            timerComplete();
        } else if (isRunning) {
            startBtn.className = 'btn btn-pause';
        }
    }

    function resetLights() {
        // Reset to green when not running
        light.className = 'light';
        if (!isRunning) {
            light.classList.add('red');
        } else {
            // If running, update to correct color based on time
            updateLights();
        }
    }
});
