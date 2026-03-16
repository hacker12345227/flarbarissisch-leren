/* ---------------- */
/* STREAK SYSTEM */
/* ---------------- */

function updateStreak(){

const today = new Date().toDateString()

const lastVisit =
localStorage.getItem("lastVisit")

let streak =
parseInt(localStorage.getItem("streak") || 0)

if(lastVisit !== today){

streak++

localStorage.setItem("streak", streak)
localStorage.setItem("lastVisit", today)

}

}

/* ---------------- */
/* LEARNED WORDS */
/* ---------------- */

function getLearnedWords(){

return JSON.parse(
localStorage.getItem("learnedWords") || "[]"
)

}

/* ---------------- */
/* QUIZ SCORE */
/* ---------------- */

function getQuizScore(){

return parseInt(
localStorage.getItem("quizScore") || 0
)

}

/* ---------------- */
/* UPDATE UI */
/* ---------------- */

function updateHomeStats(){

updateStreak()

const streak =
localStorage.getItem("streak") || 0

const learned =
getLearnedWords().length

const quiz =
getQuizScore()

const streakEl =
document.getElementById("streak")

const learnedEl =
document.getElementById("learned")

const quizEl =
document.getElementById("quizScore")

if(streakEl) streakEl.innerText = streak
if(learnedEl) learnedEl.innerText = learned
if(quizEl) quizEl.innerText = quiz

}

/* ---------------- */

document.addEventListener(
"DOMContentLoaded",
updateHomeStats
)
