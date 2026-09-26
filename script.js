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
