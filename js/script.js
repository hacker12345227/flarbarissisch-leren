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
/* INIT PAGE */
/* ---------------- */

function initPage(){

updateStats()

initFlashcards()

initQuiz()

}

/* ---------------- */
/* STATS */
/* ---------------- */

function updateStats(){

const streak = localStorage.getItem("streak") || 0
const learned = JSON.parse(localStorage.getItem("learnedWords") || "[]").length
const quiz = localStorage.getItem("quizScore") || 0

const streakEl = document.getElementById("streak")
const learnedEl = document.getElementById("learned")
const quizEl = document.getElementById("quizScore")

if(streakEl) streakEl.innerText = streak
if(learnedEl) learnedEl.innerText = learned
if(quizEl) quizEl.innerText = quiz

}

/* ---------------- */
/* AUDIO */
/* ---------------- */

function speak(text){

if(!text) return

const utter = new SpeechSynthesisUtterance(text)

utter.lang = "nl-NL"

speechSynthesis.speak(utter)

}

/* ---------------- */
/* FLASHCARDS */
/* ---------------- */

let flashIndex = 0
let currentWord = ""
let currentFlar = ""

function initFlashcards(){

const front = document.getElementById("front")

if(!front || entries.length === 0) return

showCard()

const card = document.getElementById("flashcard")

if(card){

card.addEventListener("click", flipCard)

}

}

function showCard(){

const front = document.getElementById("front")
const back = document.getElementById("back")

const [nl, flar] = entries[flashIndex]

currentWord = nl
currentFlar = flar

if(front) front.innerText = nl
if(back) back.innerText = ""

}

function flipCard(){

const back = document.getElementById("back")

if(!back) return

if(back.innerText === ""){

back.innerText = currentFlar

}else{

back.innerText = ""

}

}

function nextCard(){

flashIndex++

if(flashIndex >= entries.length){

flashIndex = 0

}

showCard()

}

function speakWord(){

speak(currentFlar)

}

/* ---------------- */
/* QUIZ */
/* ---------------- */

let score = 0

function initQuiz(){

const question = document.getElementById("question")

if(!question) return

nextQuestion()

}

function nextQuestion(){

const keys = Object.keys(dictionary)

if(keys.length === 0) return

const correct = keys[Math.floor(Math.random()*keys.length)]

const flar = dictionary[correct]

const question = document.getElementById("question")
const answers = document.getElementById("answers")
const result = document.getElementById("result")

if(question) question.innerText = `Wat betekent "${flar}"?`

if(!answers) return

answers.innerHTML = ""

let options = [correct]

while(options.length < 4){

let rand = keys[Math.floor(Math.random()*keys.length)]

if(!options.includes(rand)) options.push(rand)

}

options.sort(()=>Math.random()-0.5)

options.forEach(opt => {

const btn = document.createElement("button")

btn.className = "answer-btn"

btn.innerText = opt

btn.onclick = () => {

if(opt === correct){

if(result) result.innerText = "✅ Goed!"

score++

localStorage.setItem("quizScore", score)

}else{

if(result) result.innerText = `❌ Fout (goed: ${correct})`

}

setTimeout(nextQuestion,1000)

}

answers.appendChild(btn)

})

}

/* ---------------- */

loadDictionary()
