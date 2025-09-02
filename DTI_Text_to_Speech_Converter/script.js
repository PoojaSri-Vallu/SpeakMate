const text = document.getElementById("textToConvert");
const convertBtn = document.getElementById("convertBtn");
const pauseBtn = document.getElementById("pauseBtn");
const replayBtn = document.getElementById("replayBtn");
const stopBtn = document.getElementById("stopBtn");
const speedSelect = document.getElementById("speedSelect");

let speechSynth = window.speechSynthesis;
let currentUtterance = null;
let isPaused = false; 

// Function to auto-expand the text area
function autoResize() {
    text.style.height = "auto";
    text.style.height = text.scrollHeight + "px";
}

text.addEventListener("input", autoResize);

// Speech Function
function speakText(textToSpeak) {
    if (speechSynth.speaking) {
        speechSynth.cancel();
    }

    currentUtterance = new SpeechSynthesisUtterance(textToSpeak);
    currentUtterance.rate = parseFloat(speedSelect.value); // Get selected speed

    currentUtterance.onstart = () => {
        if (!isPaused) {
            convertBtn.textContent = "Playing...";
        }
        pauseBtn.disabled = false;
        replayBtn.disabled = false;
        stopBtn.disabled = false;
    };

    currentUtterance.onend = () => {
        convertBtn.textContent = "Play";
        pauseBtn.disabled = true;
        replayBtn.disabled = false;
        stopBtn.disabled = true;
        pauseBtn.textContent = "Pause";
        isPaused = false;
    };

    speechSynth.speak(currentUtterance);
}

// Play Button
convertBtn.addEventListener("click", function () {
    const enteredText = text.value.trim();
    const error = document.querySelector('.error-para');

    if (!enteredText.length) {
        error.textContent = "Please enter text to convert!";
    } else {
        error.textContent = "";
        speakText(enteredText);
    }
});

// Pause/Resume Button
pauseBtn.addEventListener("click", function () {
    if (speechSynth.speaking && !isPaused) {
        speechSynth.pause();
        pauseBtn.textContent = "Resume";
        convertBtn.textContent = "Play"; 
        isPaused = true;
    } else if (isPaused) {
        speechSynth.resume();
        pauseBtn.textContent = "Pause";
        convertBtn.textContent = "Playing...";
        isPaused = false;
    }
});

// Replay Button
replayBtn.addEventListener("click", function () {
    if (currentUtterance) {
        speechSynth.cancel();
        speakText(currentUtterance.text);
        pauseBtn.textContent = "Pause"; 
        isPaused = false;
    }
});

// Stop Button
stopBtn.addEventListener("click", function () {
    if (speechSynth.speaking || isPaused) {
        speechSynth.cancel();
        convertBtn.textContent = "Play";
        pauseBtn.disabled = true;
        replayBtn.disabled = false;
        stopBtn.disabled = true;
        pauseBtn.textContent = "Pause";
        isPaused = false;
    }
});

// *Change Speed While Playing*
speedSelect.addEventListener("change", function () {
    if (speechSynth.speaking && currentUtterance) {
        speechSynth.cancel(); // Stop current speech
        speakText(currentUtterance.text); // Restart with new speed
    }
});