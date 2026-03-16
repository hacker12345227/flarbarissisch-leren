const dictionaryURL =
"https://www.translate.straykids.nl/dictionary.json"

let dictionary = {}

fetch(dictionaryURL)
.then(res=>res.json())
.then(data=>{

dictionary=data

loadChapters()

})

function loadChapters(){

let container = document.getElementById("chapterList")

if(!container) return

chapters.forEach(ch=>{

let card=document.createElement("div")

card.className="chapterCard"

card.innerHTML=`

<h2>Hoofdstuk ${ch.id}</h2>

<p>${ch.title}</p>

<a href="les.html?chapter=${ch.id}">Start les</a>

`

container.appendChild(card)

})

}
