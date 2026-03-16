const DICTIONARY_URL = "https://www.translate.straykids.nl/dictionary.json";

let dictionary = {};
let entries = [];

const STORAGE_KEYS = {
  learned: "flar_learned_words",
  streak: "flar_streak_data",
  quizCorrect: "flar_quiz_correct_total"
};

async function loadDictionary() {
  const res = await fetch(DICTIONARY_URL);
  dictionary = await res.json();
  entries = Object.entries(dictionary);
  updateDashboardStats();
  initPage();
}

function getLearnedWords() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.learned) || "[]");
}

function setLearnedWords(words) {
  localStorage.setItem(STORAGE_KEYS.learned, JSON.stringify(words));
  updateDashboardStats();
}

function markWordLearned(word) {
  const learned = new Set(getLearnedWords());
  learned.add(word);
  setLearnedWords([...learned]);
  updateFlashcardLearned();
}

function touchStreak() {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const raw = localStorage.getItem(STORAGE_KEYS.streak);
  const current = raw
    ? JSON.parse(raw)
    : { streak: 0, lastDate: null };

  if (current.lastDate === todayStr) return current.streak;

  if (!current.lastDate) {
    current.streak = 1;
  } else {
    const last = new Date(current.lastDate + "T00:00:00");
    const diffDays = Math.round((today - last) / 86400000);

    if (diffDays === 1) {
      current.streak += 1;
    } else if (diffDays > 1) {
      current.streak = 1;
    }
  }

  current.lastDate = todayStr;
  localStorage.setItem(STORAGE_KEYS.streak, JSON.stringify(current));
  updateDashboardStats();
  return current.streak;
}

function getStreak() {
  const raw = localStorage.getItem(STORAGE_KEYS.streak);
  if (!raw) return 0;
  return JSON.parse(raw).streak || 0;
}

function getQuizCorrectTotal() {
  return Number(localStorage.getItem(STORAGE_KEYS.quizCorrect) || "0");
}

function incrementQuizCorrect() {
  const next = getQuizCorrectTotal() + 1;
  localStorage.setItem(STORAGE_KEYS.quizCorrect, String(next));
  updateDashboardStats();
}

function updateDashboardStats() {
  const streakEl = document.getElementById("streakValue");
  const learnedEl = document.getElementById("learnedValue");
  const quizEl = document.getElementById("quizValue");

  if (streakEl) streakEl.textContent = `${getStreak()} dagen`;
  if (learnedEl) learnedEl.textContent = `${getLearnedWords().length} woorden`;
  if (quizEl) quizEl.textContent = `${getQuizCorrectTotal()} goed`;
}

function speakText(text) {
  if (!text || !text.trim()) return;
  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "nl-NL";
  utter.rate = 0.92;
  utter.pitch = 1;
  speechSynthesis.speak(utter);
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function initPage() {
  if (document.getElementById("wordTableBody")) initWordsPage();
  if (document.getElementById("flashcard")) initFlashcardsPage();
  if (document.getElementById("quizQuestion")) initQuizPage();
  if (document.getElementById("streakValue")) touchStreak();
}

function initWordsPage() {
  const tableBody = document.getElementById("wordTableBody");
  const searchInput = document.getElementById("searchInput");
  const shuffleBtn = document.getElementById("shuffleWordsBtn");

  let currentEntries = [...entries];

  const render = (rows) => {
    tableBody.innerHTML = "";
    rows.forEach(([nl, flar]) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(nl)}</td>
        <td>${escapeHtml(flar)}</td>
        <td><button class="icon-btn" type="button" data-speak="${escapeHtml(flar)}">🔊</button></td>
      `;
      tableBody.appendChild(tr);
    });

    tableBody.querySelectorAll("[data-speak]").forEach((btn) => {
      btn.addEventListener("click", () => {
        speakText(btn.dataset.speak);
      });
    });
  };

  render(currentEntries);

  searchInput.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();
    const filtered = currentEntries.filter(([nl, flar]) =>
      nl.toLowerCase().includes(q) || flar.toLowerCase().includes(q)
    );
    render(filtered);
  });

  shuffleBtn.addEventListener("click", () => {
    currentEntries = shuffle(currentEntries);
    render(currentEntries);
  });
}

function initFlashcardsPage() {
  const flashcard = document.getElementById("flashcard");
  const flashcardInner = document.getElementById("flashcardInner");
  const front = document.getElementById("flashcardFront");
  const back = document.getElementById("flashcardBack");
  const nextBtn = document.getElementById("nextFlashBtn");
  const speakBtn = document.getElementById("speakFlashBtn");
  const learnedBtn = document.getElementById("markLearnedBtn");
  const counterEl = document.getElementById("flashcardCounter");

  let index = 0;
  const cardEntries = shuffle(entries);

  const renderCard = () => {
    const [nl, flar] = cardEntries[index];
    front.textContent = nl;
    back.textContent = flar;
    flashcardInner.classList.remove("is-flipped");
    counterEl.textContent = `${index + 1} / ${cardEntries.length}`;
    updateFlashcardLearned();
  };

  flashcard.addEventListener("click", () => {
    flashcardInner.classList.toggle("is-flipped");
  });

  nextBtn.addEventListener("click", () => {
    index = (index + 1) % cardEntries.length;
    renderCard();
    touchStreak();
  });

  speakBtn.addEventListener("click", () => {
    const [, flar] = cardEntries[index];
    speakText(flar);
  });

  learnedBtn.addEventListener("click", () => {
    const [nl] = cardEntries[index];
    markWordLearned(nl);
    learnedBtn.textContent = "✅ Opgeslagen";
    setTimeout(() => {
      learnedBtn.textContent = "✅ Markeer als geleerd";
    }, 900);
  });

  renderCard();
}

function updateFlashcardLearned() {
  const el = document.getElementById("flashcardLearned");
  if (el) {
    el.textContent = `${getLearnedWords().length} geleerd`;
  }
}

function initQuizPage() {
  const questionEl = document.getElementById("quizQuestion");
  const answersEl = document.getElementById("quizAnswers");
  const feedbackEl = document.getElementById("quizFeedback");
  const progressEl = document.getElementById("quizProgress");
  const scoreEl = document.getElementById("quizScore");

  let questionCount = 0;
  let correctThisSession = 0;

  const nextQuestion = () => {
    questionCount += 1;
    progressEl.textContent = `Vraag ${questionCount}`;
    scoreEl.textContent = `${correctThisSession} goed`;
    feedbackEl.textContent = "";
    answersEl.innerHTML = "";

    const keys = Object.keys(dictionary);
    const correctNl = keys[Math.floor(Math.random() * keys.length)];
    const flarWord = dictionary[correctNl];

    questionEl.textContent = `Wat betekent "${flarWord}"?`;

    const options = new Set([correctNl]);
    while (options.size < 4) {
      options.add(keys[Math.floor(Math.random() * keys.length)]);
    }

    shuffle([...options]).forEach((option) => {
      const btn = document.createElement("button");
      btn.className = "answer-btn";
      btn.type = "button";
      btn.textContent = option;

      btn.addEventListener("click", () => {
        const all = answersEl.querySelectorAll(".answer-btn");
        all.forEach((b) => (b.disabled = true));

        if (option === correctNl) {
          btn.classList.add("correct");
          feedbackEl.textContent = "✅ Goed!";
          correctThisSession += 1;
          incrementQuizCorrect();
          touchStreak();
        } else {
          btn.classList.add("wrong");
          feedbackEl.textContent = `❌ Fout. Goed antwoord: ${correctNl}`;
          all.forEach((b) => {
            if (b.textContent === correctNl) b.classList.add("correct");
          });
        }

        scoreEl.textContent = `${correctThisSession} goed`;

        setTimeout(() => {
          nextQuestion();
        }, 900);
      });

      answersEl.appendChild(btn);
    });
  };

  nextQuestion();
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loadDictionary().catch((err) => {
  console.error("Kon dictionary niet laden:", err);
  const containers = document.querySelectorAll(".container");
  containers.forEach((container) => {
    const error = document.createElement("section");
    error.className = "card";
    error.style.padding = "24px";
    error.innerHTML = `
      <h2>Dictionary laden mislukt</h2>
      <p>Controleer of de URL bereikbaar is en of CORS is toegestaan.</p>
    `;
    container.appendChild(error);
  });
});
