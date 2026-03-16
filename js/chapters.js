/* 
Hoofdstukken voor de cursus.
De woorden hier moeten ook bestaan in dictionary.json
*/

const chapters = [

{
id: 1,
title: "Voorstellen",
description: "Leer jezelf voorstellen",

words: [
"ik",
"jij",
"hij",
"wij",
"jullie",
"zij",
"naam",
"hallo",
"doei",
"persoon",
"vriend"
]

},

{
id: 2,
title: "Plaatsen",
description: "Woorden over plekken",

words: [
"huis",
"stad",
"school",
"kamer",
"straat",
"gebouw"
]

},

{
id: 3,
title: "Werkwoorden",
description: "Belangrijke werkwoorden",

words: [
"gaan",
"komen",
"zien",
"eten",
"lopen",
"spreken"
]

},

{
id: 4,
title: "Basiswoorden",
description: "Veelgebruikte woorden",

words: [
"ja",
"nee",
"dank",
"goed",
"slecht",
"groot",
"klein"
]

}

]

/* ---------------- */
/* HOOFDSTUK OPHALEN */
/* ---------------- */

function getChapter(id){

return chapters.find(ch => ch.id == id)

}

/* ---------------- */
/* WOORDEN VAN HOOFDSTUK */
/* ---------------- */

function getChapterWords(id){

const chapter = getChapter(id)

if(!chapter) return []

return chapter.words

}

/* ---------------- */
/* CONTROLE: BESTAAT WOORD IN DICTIONARY */
/* ---------------- */

function wordExists(word){

if(!window.dictionary) return false

return dictionary[word] !== undefined

}

/* ---------------- */
/* FILTER WOORDEN DIE BESTAAN */
/* ---------------- */

function getValidChapterWords(id){

const words = getChapterWords(id)

return words.filter(word => wordExists(word))

}

/* ---------------- */
/* VOLGENDE HOOFDSTUK */
/* ---------------- */

function getNextChapter(id){

const index = chapters.findIndex(ch => ch.id == id)

if(index === -1) return null

return chapters[index + 1] || null

}

/* ---------------- */
/* VORIGE HOOFDSTUK */
/* ---------------- */

function getPrevChapter(id){

const index = chapters.findIndex(ch => ch.id == id)

if(index === -1) return null

return chapters[index - 1] || null

}
