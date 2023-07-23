const audio_1 = new Audio("sounds/1.mp3");
const audio_2 = new Audio("sounds/2.mp3");
const audio_3 = new Audio("sounds/3.mp3");

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

type CharStatsType = {
  typed: number;
  correct: number;
};

type LetterState = "correct" | "incorrect" | "fixed" | "incomplete";

const allLetters = INITIAL_TEXT.split("");
let lettersTyped = 0;
let counter = 0;
let characterStats: { [key: string]: CharStatsType } = {};
const progressByLetter: LetterState[] = new Array(allLetters.length);

const init = () => {
  createCharacterObject();
  createProgressArray();
  addLettersToScreen();
  addEventListeners();
  updateLetterDebugger();
  updateCurrentLetterStyling();
};

const createCharacterObject = () => {
  for (const char of ALLOWED_LETTERS) {
    if (characterStats[char] !== undefined) {
      continue;
    } else {
      characterStats[char] = {
        typed: 0,
        correct: 0,
      };
    }
  }
};

const createProgressArray = () => {
  progressByLetter.fill("incomplete");
};

const addLettersToScreen = () => {
  for (const letter of allLetters) {
    const letterDiv = document.createElement("span");
    letterDiv.className = "letter";
    letterDiv.id = counter.toString();
    counter++;

    letterDiv.innerText = letter;
    text?.appendChild(letterDiv);
  }
};

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

const handleTyping = (e: KeyboardEvent) => {
  playRandomSound();
  const currentLetter = allLetters[lettersTyped];
  const thisLetterDiv = document.getElementById(lettersTyped.toString());

  if (
    e.key === "Backspace" ||
    e.key === " " ||
    ALLOWED_LETTERS.includes(e.key.toLowerCase())
  ) {
    if (e.key === "Backspace") {
      if (lettersTyped < 1) {
        return;
      }
      lettersTyped--;
      const previousLetterDiv = document.getElementById(
        lettersTyped.toString()
      );

      if (previousLetterDiv !== null) {
        // TODO; this should be in updateLetterStyling();
        thisLetterDiv.className = "letter";
        previousLetterDiv.className = "letter current";
      }

      updateLetterDebugger();
      return;
    }

    if (e.key === currentLetter || (e.key === " " && currentLetter === " ")) {
      thisLetterDiv?.classList.remove("incorrect");
      progressByLetter[lettersTyped] =
        progressByLetter[lettersTyped] === "incorrect" ? "fixed" : "correct";

      thisLetterDiv?.classList.add(progressByLetter[lettersTyped]);
    } else {
      thisLetterDiv?.classList.remove("correct");
      thisLetterDiv?.classList.add("incorrect");
      progressByLetter[lettersTyped] = "incorrect";
    }

    lettersTyped++;
    updateCurrentLetterStyling();
    updateLetterDebugger();
  }
};

const updateCurrentLetterStyling = () => {
  const letters = document.querySelectorAll(".letter");

  for (const letter of letters) {
    letter.classList.remove("current");

    if (letter.id === lettersTyped.toString()) {
      letter.classList.add("current");
      if (progressByLetter[lettersTyped] !== "incomplete") {
        letter.classList.add(progressByLetter[lettersTyped]);
      }
    }
  }
};

const addEventListeners = () => {
  document.addEventListener("keydown", handleTyping);
};

init();
