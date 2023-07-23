"use strict";
var audio_1 = new Audio("sounds/1.mp3");
var audio_2 = new Audio("sounds/2.mp3");
var audio_3 = new Audio("sounds/3.mp3");
const sounds = [audio_1, audio_2, audio_3];
const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
const PUNCTUATION = ".,?!'\";:";
const ALLOWED_LETTERS = ALPHABET + PUNCTUATION;
const INITIAL_TEXT = `Without a blush, men made their way in the world by the means of women blushing. 
Such as were only beautiful gave their beauty, whence, without doubt, comes the proverb, 
“The most beautiful girl in the world can only give what she has.” Such as were rich gave in addition a part of their money;`;
// and a vast number of heroes of that gallant period may be cited who would neither have won their spurs in the first place,
// nor their battles afterward, without the purse, more or less furnished, which their mistress fastened to the saddle bow.`;
const text = document.getElementById("text");
const lettersTypedCountDiv = document.getElementById("letters-typed");
const currentLetterDiv = document.getElementById("current-letter");
const allLetters = INITIAL_TEXT.split("");
let lettersTyped = 0;
let counter = 0;
for (const letter of allLetters) {
    const letterDiv = document.createElement("span");
    letterDiv.className = "letter";
    letterDiv.id = counter.toString();
    counter++;
    letterDiv.innerText = letter;
    text === null || text === void 0 ? void 0 : text.appendChild(letterDiv);
}
const playRandomSound = () => {
    for (const sound of sounds) {
        sound.pause();
        sound.currentTime = 0;
    }
    const randomAudio = sounds[Math.floor(Math.random() * sounds.length)];
    randomAudio.play();
};
const updateLetterDebugger = () => {
    if (lettersTypedCountDiv === null || currentLetterDiv === null) {
        return;
    }
    lettersTypedCountDiv.innerText = lettersTyped.toString();
    currentLetterDiv.innerText = allLetters[lettersTyped];
};
const handleTyping = (e) => {
    playRandomSound();
    const currentLetter = allLetters[lettersTyped];
    const thisLetterDiv = document.getElementById(lettersTyped.toString());
    if (e.key === "Backspace" ||
        e.key === " " ||
        ALLOWED_LETTERS.includes(e.key.toLowerCase())) {
        if (e.key === "Backspace") {
            if (lettersTyped < 1) {
                return;
            }
            lettersTyped--;
            const previousLetterDiv = document.getElementById(lettersTyped.toString());
            if (previousLetterDiv !== null) {
                previousLetterDiv.className = "letter";
            }
            updateLetterDebugger();
            updateCurrentLetterStyling();
            return;
        }
        if (e.key === currentLetter || (e.key === " " && currentLetter === " ")) {
            thisLetterDiv === null || thisLetterDiv === void 0 ? void 0 : thisLetterDiv.classList.remove("incorrect");
            thisLetterDiv === null || thisLetterDiv === void 0 ? void 0 : thisLetterDiv.classList.add("correct");
        }
        else {
            thisLetterDiv === null || thisLetterDiv === void 0 ? void 0 : thisLetterDiv.classList.remove("correct");
            thisLetterDiv === null || thisLetterDiv === void 0 ? void 0 : thisLetterDiv.classList.add("incorrect");
        }
        lettersTyped++;
        updateLetterDebugger();
        updateCurrentLetterStyling();
    }
};
const updateCurrentLetterStyling = () => {
    const letters = document.querySelectorAll(".letter");
    for (const letter of letters) {
        letter.classList.remove("current");
        if (letter.id === lettersTyped.toString()) {
            letter.classList.add("current");
        }
    }
};
document.addEventListener("keydown", handleTyping);
updateLetterDebugger();
updateCurrentLetterStyling();
