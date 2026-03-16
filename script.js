let dictionary = {}

const url = "https://www.translate.straykids.nl/dictionary.json"

fetch(url)
.then(res => res.json())
.then(data => {

dictionary = data

if(document.getElementById("wordTable")){
loadWords()
}

if(document.getElementById("question")){
generateQuiz()
}

})

function loadWords(){

let table = document.getElementById("wordTable")

for(let nl in dictionary){

let tr = document.createElement("tr")

tr.innerHTML = `
<td>${nl}</td>
<td>${dictionary[nl]}</td>
`

table.appendChild(tr)

}

}

/* search */

let search = document.getElementById("search")

if(search){

search.addEventListener("input", () => {

let filter = search.value.toLowerCase()

let rows = document.querySelectorAll("#wordTable tr")

rows.forEach((row,i)=>{

if(i===0) return

let text = row.innerText.toLowerCase()

row.style.display = text.includes(filter) ? "" : "none"

})

})

}

/* quiz */

function generateQuiz(){

let keys = Object.keys(dictionary)

let random = keys[Math.floor(Math.random()*keys.length)]

document.getElementById("question").innerText =
`Wat betekent "${dictionary[random]}"?`

let answers = document.getElementById("answers")

let options = [random]

while(options.length < 4){

let rand = keys[Math.floor(Math.random()*keys.length)]

if(!options.includes(rand)){
options.push(rand)
}

}

options.sort(()=>Math.random()-0.5)

options.forEach(opt=>{

let btn = document.createElement("button")

btn.innerText = opt

btn.onclick = ()=>{

let result = document.getElementById("result")

if(opt === random){
result.innerText = "✅ Goed!"
}else{
result.innerText = "❌ Fout!"
}

}

answers.appendChild(btn)

})

}
