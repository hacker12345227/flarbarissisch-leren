/*
Hoofdstukken voor de cursus.
Alle woorden hier moeten ook bestaan in dictionary.json
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
/* HELPER FUNCTIES */
/* ---------------- */

/* hoofdstuk ophalen */

function getChapter(id){

return chapters.find(c => c.id == id)

}

/* woorden van hoofdstuk */

function getChapterWords(id){

const chapter = getChapter(id)

if(!chapter) return []

return chapter.words

}
