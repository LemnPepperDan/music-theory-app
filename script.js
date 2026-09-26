const notes = [
    "C", "C#", "D", "D#", "E", "F", 
    "F#", "G", "G#", "A", "A#", "B"
];

function transpose(note, semitones) {
    return ((note + semitones) % 12 + 12) % 12;
}

const chordFormulas = {
    major: [0, 4, 7],
    minor: [0, 3, 7],
    diminished: [0, 3, 6],
    augmented: [0, 4, 8],

    major7: [0, 4, 7, 11],
    dominant7: [0, 4, 7, 10],
    minor7: [0, 3, 7, 10],
    minorMajor7: [0, 3, 7, 11],
    halfDiminished7: [0, 3, 6, 10],
    diminished7: [0, 3, 6, 9],

    sus2: [0, 2, 7],
    sus4: [0, 5, 7],
    add9: [0, 4, 7, 14]
};

function buildChord(root, type) {
    const intervals = chordFormulas[type];

    return intervals.map(interval =>
        transpose(root, interval)
    );
}

const majorScaleIntervals = [0, 2, 4, 5, 7, 9, 11];

function majorScale(root) {
    return majorScaleIntervals.map(interval =>
        transpose(root, interval)
    );
}

function chordsInMajorKey(root) {
    const scale = majorScale(root);

    const qualities = [
        "major", "minor", "minor", "major",
        "major", "minor", "diminished"
    ];

    const numerals = [
        "I", "ii", "iii", "IV", "V", "vi", "vii°"
    ];

    const chords = [];

    for (let i = 0; i < 7; i++) {
        const chord = [
            scale[i],
            scale[(i + 2) % 7],
            scale[(i + 4) % 7],
            scale[(i + 6) % 7]
        ];

        chords.push({
            root: scale[i],
            quality: qualities[i],
            numeral: numerals[i],
            notes: chord
        });
    }

    return chords;
}

const dMajorChords = chordsInMajorKey(2);

dMajorChords.forEach(chord => {
    console.log(
        chord.numeral,
        notes[chord.root],
        chord.quality,
        chord.notes.map(n => notes[n])
    );
});

const naturalPitches = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11
};

const letters = ["C", "D", "E", "F", "G", "A", "B"];

// Match the spellings in our HTML key selector.
const majorKeyNames = [
    "C", "C#", "D", "Eb", "E", "F",
    "F#", "G", "Ab", "A", "Bb", "B"
];

function spellMajorScale(root) {
    const pitches = majorScale(root);
    const rootName = majorKeyNames[root];

    // Extract the root's letter, ignoring its accidental.
    const rootLetter = rootName[0];
    const start = letters.indexOf(rootLetter);

    return pitches.map((pitch, i) => {
        // Advance one letter for every scale degree.
        const letter = letters[(start + i) % 7];

        // Find the semitone difference from its natural pitch.
        let difference =
            (pitch - naturalPitches[letter] + 12) % 12;

        // Express downward adjustments as negative values.
        if (difference > 6) {
            difference -= 12;
        }

        const accidentals = {
            "-2": "bb",
            "-1": "b",
            "0": "",
            "1": "#",
            "2": "##"
        };

        if (!(difference in accidentals)) {
            throw new Error("Unsupported note spelling");
        }

        return letter + accidentals[difference];
    });
}
console.log(spellMajorScale(1));
// C#, D#, E#, F#, G#, A#, B#


const keySelect = document.getElementById("keySelect");
const generateButton =
    document.getElementById("generateButton");
const chordResults =
    document.getElementById("chordResults");

function displayChords() {
    const root = Number(keySelect.value);

    const chords = chordsInMajorKey(root);

    const spelledScale = spellMajorScale(root);

    chordResults.innerHTML = "";

    chords.forEach((chord, i) => {
    const card = document.createElement("div");
    card.className = "chord-card";

    // Get the correctly spelled root.
    const chordRoot = spelledScale[i];

    // Select alternating scale degrees.
    const chordNotes = [
        spelledScale[i],
        spelledScale[(i + 2) % 7],
        spelledScale[(i + 4) % 7]
    ];

    // Include the seventh if this is a seventh chord.
    if (chord.notes.length === 4) {
        chordNotes.push(spelledScale[(i + 6) % 7]);
    }

    const title = document.createElement("h3");
    title.textContent =
        `${chord.numeral} - ${chordRoot} ${chord.quality}`;

    const noteList = document.createElement("p");
    noteList.textContent = chordNotes.join(" - ");

    card.appendChild(title);
    card.appendChild(noteList);
    chordResults.appendChild(card);
});
}



generateButton.addEventListener("click", displayChords);

// Display C major when the page first loads.
displayChords();