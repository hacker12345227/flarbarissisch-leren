const DICTIONARY_URL =
"https://www.translate.straykids.nl/dictionary.json"

window.dictionary = {}
window.entries = []

/* ---------------- */
/* LOAD DICTIONARY */
/* ---------------- */

async function loadDictionary(){

try{

const res = await fetch(DICTIONARY_URL)

window.dictionary = await res.json()

window.entries = shuffleArray(
Object.entries(dictionary)
)

console.log("Dictionary geladen:", entries.length)

}catch(err){

console.error("Dictionary kon niet laden", err)

}

}

/* ---------------- */
/* SHUFFLE */
/* ---------------- */

function shuffleArray(array){

for(let i = array.length - 1; i > 0; i--){

const j = Math.floor(Math.random() * (i + 1))

[array[i], array[j]] = [array[j], array[i]]

}

return array

}

/* ---------------- */
/* AUDIO */
/* ---------------- */

function speak(text){

if(!text) return

const utter = new SpeechSynthesisUtterance(text)

utter.lang = "nl-NL"

speechSynthesis.cancel()
speechSynthesis.speak(utter)

}

/* ---------------- */
/* WORD LEARNED */
/* ---------------- */

function markLearned(word){

let learned =
JSON.parse(localStorage.getItem("learnedWords") || "[]")

if(!learned.includes(word)){

learned.push(word)

localStorage.setItem(
"learnedWords",
JSON.stringify(learned)
)

}

}

/* ---------------- */

loadDictionary()
