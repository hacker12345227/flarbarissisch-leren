const DICTIONARY_URL = "https://www.translate.straykids.nl/dictionary.json";

window.dictionary = {};
window.entries = [];

/* -------------------------- */
/* LOAD DICTIONARY            */
/* -------------------------- */

async function loadDictionary() {
  try {
    const res = await fetch(DICTIONARY_URL);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    window.dictionary = await res.json();

    window.entries = shuffleArray(Object.entries(window.dictionary));

    console.log("Dictionary geladen:", window.entries.length);

    initPage();
  } catch (err) {
    console.error("Dictionary kon niet laden:", err);
  }
}

/* -------------------------- */
/* INIT PAGE                  */
/* -------------------------- */

function initPage() {
  updateStats();
  initFlashcards();
  initQuiz();
}

/* -------------------------- */
/* HELPERS                    */
/* -------------------------- */

function shuffleArray(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function waitForDictionary(callback) {
  if (!window.dictionary || Object.keys(window.dictionary).length === 0) {
    setTimeout(() => waitForDictionary(callback), 100);
    return;
  }

  callback();
}

function getStoredArray(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function setStoredArray(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* -------------------------- */
/* STATS / PROGRESS           */
/* -------------------------- */

function updateStats() {
  const streak = parseInt(localStorage.getItem("streak") || "0", 10);
  const learned = getStoredArray("learnedWords").length;
  const quizScore = parseInt(localStorage.getItem("quizScore") || "0", 10);

  const streakEl = document.getElementById("streak");
  const learnedEl = document.getElementById("learned");
  const quizEl = document.getElementById("quizScore");

  if (streakEl) streakEl.innerText = streak;
  if (learnedEl) learnedEl.innerText = learned;
  if (quizEl) quizEl.innerText = quizScore;
}

function updateStreak() {
  const today = new Date().toDateString();
  const lastVisit = localStorage.getItem("lastVisit");
  let streak = parseInt(localStorage.getItem("streak") || "0", 10);

  if (lastVisit !== today) {
    streak += 1;
    localStorage.setItem("streak", String(streak));
    localStorage.setItem("lastVisit", today);
  }

  updateStats();
}

function markLearned(word) {
  if (!word) return;

  const learned = getStoredArray("learnedWords");

  if (!learned.includes(word)) {
    learned.push(word);
    setStoredArray("learnedWords", learned);
  }

  updateStats();
}

/* -------------------------- */
/* AUDIO                      */
/* -------------------------- */

function speak(text) {
  if (!text || !text.trim()) return;

  speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "nl-NL";
  utter.rate = 0.9;
  utter.pitch = 1;

  speechSynthesis.speak(utter);
}

/* -------------------------- */
/* FLASHCARDS                 */
/* -------------------------- */

let flashIndex = 0;
let currentWord = "";
let currentFlar = "";

function initFlashcards() {
  const front = document.getElementById("front");
  const back = document.getElementById("back");
  const card = document.getElementById("flashcard");

  if (!front || !back || !card) return;
  if (!window.entries.length) return;

  showCard();

  if (!card.dataset.bound) {
    card.addEventListener("click", flipCard);
    card.dataset.bound = "true";
  }
}

function showCard() {
  const front = document.getElementById("front");
  const back = document.getElementById("back");
  const card = document.getElementById("flashcard");

  if (!front || !back || !card) return;
  if (!window.entries.length) return;

  const [nl, flar] = window.entries[flashIndex];

  currentWord = nl;
  currentFlar = flar;

  front.innerText = nl;
  back.innerText = "";
  card.classList.remove("is-flipped");
}

function flipCard() {
  const card = document.getElementById("flashcard");
  const back = document.getElementById("back");

  if (!card || !back) return;

  if (back.innerText === "") {
    back.innerText = currentFlar;
  }

  card.classList.toggle("is-flipped");
}

function nextCard() {
  if (!window.entries.length) return;

  flashIndex += 1;

  if (flashIndex >= window.entries.length) {
    window.entries = shuffleArray(window.entries);
    flashIndex = 0;
  }

  showCard();
}

function speakWord() {
  if (currentFlar) {
    speak(currentFlar);
  }
}

/* -------------------------- */
/* QUIZ                       */
/* -------------------------- */

let currentQuizScore = parseInt(localStorage.getItem("quizScore") || "0", 10);
let currentQuestionNumber = 0;

function initQuiz() {
  const question = document.getElementById("question");
  const answers = document.getElementById("answers");

  if (!question || !answers) return;
  if (!window.dictionary || Object.keys(window.dictionary).length === 0) return;

  nextQuestion();
}

function nextQuestion() {
  const keys = Object.keys(window.dictionary);

  if (!keys.length) return;

  currentQuestionNumber += 1;

  const correctWord = keys[Math.floor(Math.random() * keys.length)];
  const flarWord = window.dictionary[correctWord];

  const question = document.getElementById("question");
  const answers = document.getElementById("answers");
  const result = document.getElementById("result");
  const scoreDisplay = document.getElementById("quizScoreDisplay");
  const questionDisplay = document.getElementById("questionNumber");

  if (question) {
    question.innerText = `Wat betekent "${flarWord}"?`;
  }

  if (scoreDisplay) {
    scoreDisplay.innerText = currentQuizScore;
  }

  if (questionDisplay) {
    questionDisplay.innerText = currentQuestionNumber;
  }

  if (result) {
    result.innerText = "";
  }

  if (!answers) return;

  answers.innerHTML = "";

  const options = [correctWord];

  while (options.length < 4) {
    const randomWord = keys[Math.floor(Math.random() * keys.length)];
    if (!options.includes(randomWord)) {
      options.push(randomWord);
    }
  }

  const shuffledOptions = shuffleArray(options);

  shuffledOptions.forEach((option) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.type = "button";
    btn.innerText = option;

    btn.onclick = () => {
      const allButtons = answers.querySelectorAll("button");
      allButtons.forEach((b) => (b.disabled = true));

      if (option === correctWord) {
        btn.classList.add("correct");
        if (result) result.innerText = "✅ Goed!";
        currentQuizScore += 1;
        localStorage.setItem("quizScore", String(currentQuizScore));
        updateStreak();
      } else {
        btn.classList.add("wrong");
        if (result) result.innerText = `❌ Fout — goed: ${correctWord}`;

        allButtons.forEach((b) => {
          if (b.innerText === correctWord) {
            b.classList.add("correct");
          }
        });
      }

      updateStats();

      setTimeout(() => {
        nextQuestion();
      }, 1000);
    };

    answers.appendChild(btn);
  });
}

/* -------------------------- */
/* OPTIONAL HELPERS           */
/* -------------------------- */

function getWordTranslation(word) {
  return window.dictionary[word] || null;
}

function getRandomEntry() {
  if (!window.entries.length) return null;
  return window.entries[Math.floor(Math.random() * window.entries.length)];
}

/* -------------------------- */
/* START                      */
/* -------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  updateStats();
  loadDictionary();
});
