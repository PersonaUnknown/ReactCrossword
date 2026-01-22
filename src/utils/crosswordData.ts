import type { CrosswordData } from "./types"

// One row crossword
export const singleRowCrossword: CrosswordData = {
    "title": "Single Row",
    "width": 3,
    "height": 1,
    "tiles": [
        { "type": "word", "character": "A", "cornerValue": 1, "across": 1, "down": -1 },
        { "type": "word", "character": "R", "cornerValue": -1, "across": 1, "down": -1 },
        { "type": "word", "character": "E", "cornerValue": -1, "across": 1, "down": -1 },
    ],
    "words": new Map([
        [
            1, 
            {
                "across": {
                    "word": "ARE",
                    "hint": "Insert hint here. Type \"ARE\" to win.",
                    "startIndex": 0
                },
                "down": null
            }
        ]
    ])
};

// Crossword I got from: https://games.aarp.org/games/daily-mini-crossword
export const exampleMiniCrossword: CrosswordData = {
    "title": "Mini Crossword 5x5",
    "width": 5,
    "height": 5,
    "tiles": [
        { "type": "word", "character": "S", "cornerValue": 1, "across": 1, "down": -1 },
        { "type": "word", "character": "T", "cornerValue": 2, "across": 1, "down": 2 },
        { "type": "word", "character": "A", "cornerValue": 3, "across": 1, "down": 3 },
        { "type": "word", "character": "R", "cornerValue": 4, "across": 1, "down": 4 },
        { "type": "background", "character": "", "cornerValue": -1, "across": -1, "down": -1 },
        { "type": "background", "character": "", "cornerValue": -1, "across": -1, "down": -1 },
        { "type": "word", "character": "I", "cornerValue": 5, "across": 5, "down": 2 },
        { "type": "word", "character": "D", "cornerValue": -1, "across": 5, "down": 3 },
        { "type": "word", "character": "E", "cornerValue": -1, "across": 5, "down": 4 },
        { "type": "word", "character": "A", "cornerValue": 6, "across": 5, "down": 6 },
        { "type": "word", "character": "B", "cornerValue": 7, "across": 7, "down": 7 },
        { "type": "word", "character": "R", "cornerValue": -1, "across": 7, "down": 2 },
        { "type": "word", "character": "A", "cornerValue": -1, "across": 7, "down": 3 },
        { "type": "word", "character": "I", "cornerValue": -1, "across": 7, "down": 4 },
        { "type": "word", "character": "N", "cornerValue": -1, "across": 7, "down": 6 },
        { "type": "word", "character": "Y", "cornerValue": 8, "across": 8, "down": 7 },
        { "type": "word", "character": "E", "cornerValue": -1, "across": 8, "down": 2 },
        { "type": "word", "character": "G", "cornerValue": -1, "across": 8, "down": 3 },
        { "type": "word", "character": "G", "cornerValue": -1, "across": 8, "down": 4 },
        { "type": "background", "character": "", "cornerValue": -1, "across": -1, "down": -1 },
        { "type": "background", "character": "", "cornerValue": -1, "across": -1, "down": -1 },
        { "type": "word", "character": "D", "cornerValue": 9, "across": 9, "down": 2 },
        { "type": "word", "character": "E", "cornerValue": -1, "across": 9, "down": 3 },
        { "type": "word", "character": "N", "cornerValue": -1, "across": 9, "down": 4 },
        { "type": "word", "character": "T", "cornerValue": -1, "across": 9, "down": -1 },
    ],
    "words": new Map([
        [
            1, 
            {
                "across": {
                    word: "STAR",
                    hint: "Sun, e.g.",
                    startIndex: 0
                },
                "down": null
            }
        ],
        [
            2, 
            {
                across: null,
                down: {
                    word: "TIRED",
                    hint: "Weary",
                    startIndex: 1,
                }
            }
        ],
        [
            3, 
            {
                across: null,
                down: {
                    word: "ADAGE",
                    hint: "\"Time is money\", e.g.",
                    startIndex: 2,
                }    
            }
        ],
        [
            4, 
            {
                across: null,
                down: {
                    word: "REIGN",
                    hint: "Sovereignty",
                    startIndex: 3,
                }    
            }
        ],
        [
            5, 
            {
                across: {
                    word: "IDEA",
                    hint: "Thought",
                    startIndex: 6
                },
                down: null
            }
        ],
        [
            6, 
            {
                across: null,
                down: {
                    word: "AN",
                    hint: "Indefinite article",
                    startIndex: 9,
                }
            }
        ],
        [
            7, 
            {
                across:  {
                    word: "BRAIN",
                    hint: "Scarecrow's wish in \"The Wizard of Oz\"",
                    startIndex: 10
                },
                down: {
                    word: "BY",
                    hint: "Hard to come __",
                    startIndex: 10,
                }
            }
        ],
        [
            8, 
            {
                across: {
                    word: "YEGG",
                    hint: "Burglar",
                    startIndex: 15
                },
                down: null
            }
        ],
        [
            9, 
            {
                across: {
                    word: "DENT",
                    hint: "Damage to a car",
                    startIndex: 21
                },
                down: null
            }
        ]
    ])
}
