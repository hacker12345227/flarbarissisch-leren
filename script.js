const DICTIONARY_URL =
"https://www.translate.straykids.nl/dictionary.json"

let dictionary={}
let entries=[]

async function loadDictionary(){

try{

const res=await fetch(DICTIONARY_URL)
dictionary=await res.json()

entries=Object.entries(dictionary)

initPage()

}catch(err){

console.error("Dictionary kon niet laden",err)

}

}

function initPage(){

loadChapters()
loadLesson()
initFlashcards()
initQuiz()

}

/* ---------------- */
/* HOOFDSTUKKEN */
/* ---------------- */

function loadChapters(){

const container=document.getElementById("chapters")

if(!container) return

chapters.forEach(ch=>{

const div=document.createElement("div")

div.className="card"

div.innerHTML=`

<h2>Hoofdstuk ${ch.id}</h2>
<p>${ch.title}</p>
<a href="les.html?chapter=${ch.id}">Start les</a>

`

container.appendChild(div)

})

}

/* ---------------- */
/* LES PAGINA */
/* ---------------- */

function loadLesson(){

const table=document.getElementById("lessonTable")

if(!table) return

const params=new URLSearchParams(location.search)

const id=params.get("chapter")

const chapter=chapters.find(c=>c.id==id)

if(!chapter) return

document.getElementById("title").innerText=
`Hoofdstuk ${chapter.id} – ${chapter.title}`

chapter.words.forEach(word=>{

if(dictionary[word]){

const tr=document.createElement("tr")

tr.innerHTML=`

<td>${word}</td>
<td>${dictionary[word]}</td>
<td><button onclick="speak('${dictionary[word]}')">🔊</button></td>

`

table.appendChild(tr)

}

})

}

/* ---------------- */
/* AUDIO */
/* ---------------- */

function speak(text){

const utter=new SpeechSynthesisUtterance(text)

utter.lang="nl-NL"

speechSynthesis.speak(utter)

}

/* ---------------- */
/* FLASHCARDS */
/* ---------------- */

let flashIndex=0

function initFlashcards(){

const front=document.getElementById("front")

if(!front) return

nextCard()

}

function nextCard(){

const front=document.getElementById("front")
const back=document.getElementById("back")

if(!front) return

const [nl,flar]=entries[flashIndex]

front.innerText=nl
back.innerText=""

back.dataset.word=flar

flashIndex++

if(flashIndex>=entries.length) flashIndex=0

}

function flip(){

const back=document.getElementById("back")

if(back.innerText===""){

back.innerText=back.dataset.word

}else{

back.innerText=""

}

}

function speakWord(){

const back=document.getElementById("back")

if(back.dataset.word){

speak(back.dataset.word)

}

}

/* ---------------- */
/* QUIZ */
/* ---------------- */

function initQuiz(){

const question=document.getElementById("question")

if(!question) return

nextQuestion()

}

function nextQuestion(){

const keys=Object.keys(dictionary)

const correct=keys[Math.floor(Math.random()*keys.length)]

const flar=dictionary[correct]

const question=document.getElementById("question")
const answers=document.getElementById("answers")
const result=document.getElementById("result")

question.innerText=`Wat betekent "${flar}"?`

answers.innerHTML=""
result.innerText=""

let options=[correct]

while(options.length<4){

const rand=keys[Math.floor(Math.random()*keys.length)]

if(!options.includes(rand)) options.push(rand)

}

options.sort(()=>Math.random()-0.5)

options.forEach(opt=>{

const btn=document.createElement("button")

btn.innerText=opt

btn.onclick=()=>{

if(opt===correct){

result.innerText="✅ Goed!"

}else{

result.innerText=`❌ Fout (goed: ${correct})`

}

setTimeout(nextQuestion,1000)

}

answers.appendChild(btn)

})

}

/* ---------------- */

loadDictionary()
