import type { CrosswordData } from "../types/types"

// Crossword I got from: https://games.aarp.org/games/daily-mini-crossword
export const exampleCrossword: CrosswordData = {
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
    "across": new Map([
        [
            1, {
                word: "STAR",
                hint: "Sun, e.g.",
                startIndex: 0
            }
        ],
        [
            5, {
                word: "IDEA",
                hint: "Thought",
                startIndex: 6
            }
        ],
        [
            7, {
                word: "BRAIN",
                hint: "Scarecrow's wish in \"The Wizard of Oz\"",
                startIndex: 10
            }
        ],
        [
            8, {
                word: "YEGG",
                hint: "Burglar",
                startIndex: 15
            }
        ],
        [
            9, {
                word: "DENT",
                hint: "Damage to a car",
                startIndex: 21
            }
        ]
    ]),
    "down": new Map([
        [
            2, {
                word: "TIRED",
                hint: "Weary",
                startIndex: 1,
            }
        ],
        [
            2, {
                word: "TIRED",
                hint: "Weary",
                startIndex: 1,
            }
        ],
        [
            3, {
                word: "ADAGE",
                hint: "\"Time is money\", e.g.",
                startIndex: 2,
            }
        ],
        [
            4, {
                word: "REIGN",
                hint: "Sovereignty",
                startIndex: 3,
            }
        ],
        [
            6, {
                word: "AN",
                hint: "Indefinite article",
                startIndex: 9,
            }
        ],
        [
            7, {
                word: "BY",
                hint: "Hard to come __",
                startIndex: 10,
            }
        ],
    ]),
};
