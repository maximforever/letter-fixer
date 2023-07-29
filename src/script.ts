const audio_1 = new Audio("sounds/1.mp3");
const audio_2 = new Audio("sounds/2.mp3");
const audio_3 = new Audio("sounds/3.mp3");

const sounds = [audio_1, audio_2, audio_3];

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
const PUNCTUATION = ".,?!'\";:- "; // the space at the end is intentional!
const ALLOWED_CHARACTERS = ALPHABET + PUNCTUATION;
const TEXT = `For such an enduringly popular writer, Alexandre Dumas, pere, has been surprisingly ill-served by his English-language translators.`;
// This is nowhere more true than in the case of his most famous and endlessly-adapted novel,
// The Three Musketeers.`;

type CharStatsType = {
  typed: number;
  correct: number;
  averageTimeToType: number;
};

type LetterState = "correct" | "incorrect" | "fixed" | "incomplete";

type StateType = {
  allLetters: string[];
  characterStats: { [key: string]: CharStatsType };
  characterProgress: LetterState[];
  lettersTyped: number;
  lastLetterTypedTimestamp: number | null;
};

const STATE: StateType = {
  allLetters: [],
  characterStats: {},
  characterProgress: [],
  lettersTyped: 0,
  lastLetterTypedTimestamp: null,
};

const lettersTypedCountDiv = document.getElementById("letters-typed");
const currentLetterDiv = document.getElementById("current-letter");

const init = () => {
  if (lettersTypedCountDiv === null || currentLetterDiv === null) {
    return;
  }

  breakTextIntoCharacters();
  addLetterElementsToScreen();
  addEventListeners();
  setUpCharacterStats();
  setUpCharacterProgress();
  underlineFirstLetter();
  updateDebugger();
};

const underlineFirstLetter = () => {
  const firstLetterDiv = document.getElementById("0");
  firstLetterDiv?.classList.add("current");
};

const breakTextIntoCharacters = () => {
  const individualCharacters = TEXT.split("");
  STATE.allLetters = individualCharacters;
};

const addLetterElementsToScreen = () => {
  const textDiv = document.getElementById("text");
  let counter = 0;

  for (const letter of STATE.allLetters) {
    const letterDiv = document.createElement("span");
    letterDiv.className = "letter";
    letterDiv.id = counter.toString();
    counter++;

    letterDiv.innerText = letter;
    textDiv?.appendChild(letterDiv);
  }
};

const setUpCharacterStats = () => {
  for (const char of ALLOWED_CHARACTERS) {
    if (STATE.characterStats[char] !== undefined) {
      continue;
    } else {
      STATE.characterStats[char] = {
        typed: 0,
        correct: 0,
        averageTimeToType: 0,
      };
    }
  }
};

const setUpCharacterProgress = () => {
  STATE.characterProgress = new Array(STATE.allLetters.length);
  STATE.characterProgress.fill("incomplete");
};

const playRandomSound = () => {
  for (const sound of sounds) {
    sound.pause();
    sound.currentTime = 0;
  }

  const randomAudio = sounds[Math.floor(Math.random() * sounds.length)];
  randomAudio.play();
};

const recordCharacter = (correct: boolean) => {
  const character = STATE.allLetters[STATE.lettersTyped].toLowerCase();
  const characterStats = STATE.characterStats[character];
  const now = Date.now();

  if (STATE.lastLetterTypedTimestamp === null) {
    STATE.lastLetterTypedTimestamp = now;
    return;
  }
  const timeToTypeThisCharacter = now - STATE.lastLetterTypedTimestamp;

  console.log(`recording ${character} as ${correct ? "correct" : "incorrect"}`);
  console.log(`Took ${timeToTypeThisCharacter} ms`);
  const newAverageTime = Math.floor(
    (characterStats.averageTimeToType + timeToTypeThisCharacter) /
      (characterStats.typed + 1)
  );

  characterStats.typed++;
  characterStats.averageTimeToType = newAverageTime;
  characterStats.correct += correct ? 1 : 0;
  STATE.lastLetterTypedTimestamp = now;
};

const isValidChar = (key: string) => {
  return (
    key === "Backspace" ||
    key === " " ||
    ALLOWED_CHARACTERS.includes(key.toLocaleLowerCase())
  );
};

const updateDebugger = () => {
  if (lettersTypedCountDiv === null || currentLetterDiv === null) {
    return;
  }

  lettersTypedCountDiv.innerText = STATE.lettersTyped.toString();
  currentLetterDiv.innerText = STATE.allLetters[STATE.lettersTyped];
};

const deleteCharacter = () => {
  const thisLetterDiv = document.getElementById(STATE.lettersTyped.toString());
  const previousLetterDiv = document.getElementById(
    (STATE.lettersTyped - 1).toString()
  );

  if (STATE.lettersTyped === 0 || previousLetterDiv === null) {
    return;
  }

  if (thisLetterDiv !== null) {
    thisLetterDiv.className = "letter";
  }

  previousLetterDiv.className = "letter current";
  STATE.lettersTyped--;
};

const typeCharacter = (correct: boolean) => {
  const thisLetterDiv = document.getElementById(STATE.lettersTyped.toString());
  const nextLetterDiv = document.getElementById(
    (STATE.lettersTyped + 1).toString()
  );

  if (STATE.lettersTyped > STATE.allLetters.length || thisLetterDiv === null) {
    return;
  }

  if (correct) {
    if (STATE.characterProgress[STATE.lettersTyped] === "incomplete") {
      STATE.characterProgress[STATE.lettersTyped] = "correct";
      recordCharacter(true);
    } else if (STATE.characterProgress[STATE.lettersTyped] === "incorrect") {
      STATE.characterProgress[STATE.lettersTyped] = "fixed";
    }
  } else {
    STATE.characterProgress[STATE.lettersTyped] = "incorrect";
    recordCharacter(false);
  }

  nextLetterDiv?.classList.add("current");
  thisLetterDiv.classList.remove("current");
  thisLetterDiv.classList.add(STATE.characterProgress[STATE.lettersTyped]);

  STATE.lettersTyped++;
};

const handleTyping = (e: KeyboardEvent) => {
  playRandomSound();

  if (!isValidChar(e.key)) {
    return;
  }

  const currentLetter = STATE.allLetters[STATE.lettersTyped];
  const thisLetterDiv = document.getElementById(STATE.lettersTyped.toString());

  if (e.key === "Backspace") {
    deleteCharacter();
  } else {
    const currentLetter = STATE.allLetters[STATE.lettersTyped];
    // this is a valid character other than backspace
    if (e.key === currentLetter || (e.key === " " && currentLetter === " ")) {
      typeCharacter(true);
    } else {
      typeCharacter(false);
    }
  }
};

const addEventListeners = () => {
  document.addEventListener("keydown", handleTyping);
  document.addEventListener("keydown", updateDebugger);
};

init();
