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
        [1, "STAR"],
        [5, "IDEA"],
        [7, "BRAIN"],
        [8, "YEGG"],
        [9, "DENT"],
    ]),
    "down": new Map([
        [2, "TIRED"],
        [3, "ADAGE"],
        [4, "REIGN"],
        [6, "AN"],
        [7, "BY"],
    ]),
    "acrossHints": new Map([
        [1, "Sun, e.g."],
        [5, "Thought"],
        [7, "Scarecrow's wish in \"The Wizard of Oz\""],
        [8, "Burglar"],
        [9, "Damage to a car"],
    ]),
    "downHints": new Map([
        [2, "Weary"],
        [3, "\"Time is money\", e.g."],
        [4, "Sovereignty"],
        [6, "Indefinite article"],
        [7, "Hard to come __"],
    ])
}

