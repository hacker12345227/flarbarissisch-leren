const DICTIONARY_URL =
"https://www.translate.straykids.nl/dictionary.json"

let dictionary = {}
let entries = []

/* ---------------- */
/* LOAD DICTIONARY */
/* ---------------- */

async function loadDictionary(){

try{

const res = await fetch(DICTIONARY_URL)

dictionary = await res.json()

entries = Object.entries(dictionary)

initPage()

}catch(err){

console.error("Dictionary kon niet laden", err)

}

}

/* ---------------- */
/* INIT PAGINA */
/* ---------------- */

function initPage(){

updateStats()

}

/* ---------------- */
/* STREAK SYSTEM */
/* ---------------- */

function updateStats(){

let streak = localStorage.getItem("streak") || 0
let learned = localStorage.getItem("learnedWords") || 0
let quizScore = localStorage.getItem("quizScore") || 0

let streakEl = document.getElementById("streak")
let learnedEl = document.getElementById("learned")
let quizEl = document.getElementById("quizScore")

if(streakEl) streakEl.innerText = streak
if(learnedEl) learnedEl.innerText = learned
if(quizEl) quizEl.innerText = quizScore

}

/* ---------------- */
/* AUDIO */
/* ---------------- */

function speak(text){

if(!text) return

let utter = new SpeechSynthesisUtterance(text)

utter.lang = "nl-NL"

speechSynthesis.speak(utter)

}

/* ---------------- */
/* HELPER */
/* ---------------- */

function shuffle(array){

for(let i=array.length-1;i>0;i--){

let j=Math.floor(Math.random()*(i+1))

[array[i],array[j]]=[array[j],array[i]]

}

return array

}

/* ---------------- */

loadDictionary()
