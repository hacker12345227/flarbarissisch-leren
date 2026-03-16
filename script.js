const dictURL =
"https://www.translate.straykids.nl/dictionary.json"

let dictionary={}
let entries=[]

fetch(dictURL)
.then(res=>res.json())
.then(data=>{

dictionary=data

entries=Object.entries(dictionary)

loadChapters()
loadLesson()
startQuiz()

})

function loadChapters(){

let container=document.getElementById("chapters")

if(!container) return

chapters.forEach(ch=>{

let div=document.createElement("div")

div.className="card"

div.innerHTML=`

<h2>Hoofdstuk ${ch.id}</h2>
<p>${ch.title}</p>
<a href="les.html?chapter=${ch.id}">Start</a>

`

container.appendChild(div)

})

}

function loadLesson(){

let table=document.getElementById("lessonTable")

if(!table) return

let params=new URLSearchParams(location.search)

let id=params.get("chapter")

let chapter=chapters.find(c=>c.id==id)

if(!chapter) return

document.getElementById("title").innerText=
"Hoofdstuk "+chapter.id+" - "+chapter.title

chapter.words.forEach(word=>{

if(dictionary[word]){

let tr=document.createElement("tr")

tr.innerHTML=`

<td>${word}</td>
<td>${dictionary[word]}</td>
<td><button onclick="speak('${dictionary[word]}')">🔊</button></td>

`

table.appendChild(tr)

}

})

}

function speak(text){

let utter=new SpeechSynthesisUtterance(text)

utter.lang="nl-NL"

speechSynthesis.speak(utter)

}

function startQuiz(){

let question=document.getElementById("question")

if(!question) return

nextQuestion()

}

function nextQuestion(){

let keys=Object.keys(dictionary)

let correct=keys[Math.floor(Math.random()*keys.length)]

let flar=dictionary[correct]

question.innerText=
`Wat betekent "${flar}"?`

let answers=document.getElementById("answers")

answers.innerHTML=""

let options=[correct]

while(options.length<4){

let r=keys[Math.floor(Math.random()*keys.length)]

if(!options.includes(r)){
options.push(r)
}

}

options.sort(()=>Math.random()-0.5)

options.forEach(opt=>{

let btn=document.createElement("button")

btn.innerText=opt

btn.onclick=()=>{

if(opt===correct){

document.getElementById("result").innerText="✅ Goed"

}else{

document.getElementById("result").innerText="❌ Fout"

}

setTimeout(nextQuestion,1000)

}

answers.appendChild(btn)

})

}
