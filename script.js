const notes = [
    "C", "C#", "D", "D#", "E", "F", 
    "F#", "G", "G#", "A", "A#", "B"
];

const majorKeyNames = [
    "C", "C#", "D", "Eb", "E", "F",
    "F#", "G", "Ab", "A", "Bb", "B"
];

const minorKeyNames = [
    "C", "C#", "D", "Eb", "E", "F",
    "F#", "G", "G#", "A", "Bb", "B"
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
            quality: identifySeventh(chord),
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



const minorScaleIntervals = {
    natural:  [0, 2, 3, 5, 7, 8, 10],
    harmonic: [0, 2, 3, 5, 7, 8, 11],
    melodic:  [0, 2, 3, 5, 7, 9, 11]
};

const improvScaleIntervals = {
    majorPentatonic: [0, 2, 4, 7, 9],
    minorPentatonic: [0, 3, 5, 7, 10],

    majorBlues: [0, 2, 3, 4, 7, 9],
    minorBlues: [0, 3, 5, 6, 7, 10],

    dorian: [0, 2, 3, 5, 7, 9, 10],
    mixolydian: [0, 2, 4, 5, 7, 9, 10]
};

function improvScale(root, type) {
    const intervals = improvScaleIntervals[type];

    if (!intervals) {
        throw new Error("Unknown improvisation scale");
    }

    return intervals.map(interval =>
        transpose(root, interval)
    );
}

const improvScaleDegrees = {
    majorPentatonic: [0, 1, 2, 4, 5],
    minorPentatonic: [0, 2, 3, 4, 6],

    majorBlues: [0, 1, 2, 2, 4, 5],
    minorBlues: [0, 2, 3, 3, 4, 6],

    dorian: [0, 1, 2, 3, 4, 5, 6],
    mixolydian: [0, 1, 2, 3, 4, 5, 6]
};

function spellImprovScale(root, type) {
    const pitches = improvScale(root, type);
    const degrees = improvScaleDegrees[type];

    const minorTypes = [
        "minorPentatonic",
        "minorBlues",
        "dorian"
    ];

    const rootName = minorTypes.includes(type)
        ? minorKeyNames[root]
        : majorKeyNames[root];

    const start = letters.indexOf(rootName[0]);

    return pitches.map((pitch, i) => {
        const letter =
            letters[(start + degrees[i]) % 7];

        let difference =
            (pitch - naturalPitches[letter] + 12) % 12;

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

        return letter + accidentals[difference];
    });
}

function minorScale(root, type = "natural") {
    const intervals = minorScaleIntervals[type];

    if (!intervals) {
        throw new Error("Unknown minor scale type");
    }

    return intervals.map(interval =>
        transpose(root, interval)
    );
}

function spellScale(pitches, rootName) {
    const start = letters.indexOf(rootName[0]);

    return pitches.map((pitch, i) => {
        const letter = letters[(start + i) % 7];

        let difference =
            (pitch - naturalPitches[letter] + 12) % 12;

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

function spellMajorScale(root) {
    return spellScale(
        majorScale(root),
        majorKeyNames[root]
    );
}

function spellMinorScale(root, type = "natural") {
    const pitches = minorScale(root, type);
    return spellScale(pitches, minorKeyNames[root]);
}

function identifyTriad(chord) {
    const root = chord[0];

    const intervals = chord.map(note =>
        (note - root + 12) % 12
    );

    const formula = intervals.join(",");

    const qualities = {
        "0,4,7": "major",
        "0,3,7": "minor",
        "0,3,6": "diminished",
        "0,4,8": "augmented"
    };

    return qualities[formula] || "unknown";
}

function identifySeventh(chord) {
    const root = chord[0];

    const intervals = chord.map(note =>
        (note - root + 12) % 12
    );

    const formula = intervals.join(",");

    const qualities = {
        "0,4,7,11": "major7",
        "0,4,7,10": "dominant7",
        "0,3,7,10": "minor7",
        "0,3,7,11": "minorMajor7",
        "0,3,6,10": "halfDiminished7",
        "0,3,6,9": "diminished7",
        "0,4,8,11": "augmentedMajor7",
        "0,4,8,10": "augmented7"
    };

    return qualities[formula] || "unknown";
}

function chordsInMinorKey(root, type = "natural") {
    const scale = minorScale(root, type);
    const chords = [];

    for (let i = 0; i < 7; i++) {
        const chord = [
            scale[i],
            scale[(i + 2) % 7],
            scale[(i + 4) % 7],
            scale[(i + 6) % 7]
        ];

        chords.push({
            root: chord[0],
            quality: identifySeventh(chord),
            degree: i + 1,
            notes: chord
        });
    }

    return chords;
}


const keySelect = document.getElementById("keySelect");
const scaleType = document.getElementById("scaleType");
const generateButton = document.getElementById("generateButton");

const chordResults = document.getElementById("chordResults");
const scaleResults = document.getElementById("scaleResults");
const scaleTitle = document.getElementById("scaleTitle");

function updateKeyNames() {
    const type = scaleType.value;

    const minorTypes = [
        "natural", "harmonic", "melodic",
        "minorPentatonic", "minorBlues", "dorian"
    ];

    const keyNames = minorTypes.includes(type)
        ? minorKeyNames
        : majorKeyNames;

    for (let i = 0; i < 12; i++) {
        keySelect.options[i].textContent = keyNames[i];
    }
}

function displayChords() {
    const root = Number(keySelect.value);
    const type = scaleType.value;

    const isMajor = type === "major";
    const isMinor = ["natural", "harmonic", "melodic"]
        .includes(type);
    const isImprov = type in improvScaleIntervals;

    let spelledScale;
    let chords = [];

    if (isMajor) {
        spelledScale = spellMajorScale(root);
        chords = chordsInMajorKey(root);
    } else if (isMinor) {
        spelledScale = spellMinorScale(root, type);
        chords = chordsInMinorKey(root, type);
    } else if (isImprov) {
        spelledScale = spellImprovScale(root, type);
    } else {
        throw new Error("Unknown scale type");
    }

    const scaleNames = {
        major: "Major",
        natural: "Natural Minor",
        harmonic: "Harmonic Minor",
        melodic: "Melodic Minor (Ascending)",
        majorPentatonic: "Major Pentatonic",
        minorPentatonic: "Minor Pentatonic",
        majorBlues: "Major Blues",
        minorBlues: "Minor Blues",
        dorian: "Dorian",
        mixolydian: "Mixolydian"
    };

    scaleTitle.textContent =
        `${keySelect.options[keySelect.selectedIndex].text} ` +
        `${scaleNames[type]} Scale`;

    // Display the notes of the selected scale.
    scaleResults.innerHTML = "";

    spelledScale.forEach(note => {
        const noteBox = document.createElement("div");
        noteBox.className = "scale-note";
        noteBox.textContent = note;
        scaleResults.appendChild(noteBox);
    });

    // Display diatonic chords for major and minor.
    chordResults.innerHTML = "";

    const chordHeading = chordResults
        .previousElementSibling;

    if (isImprov) {
        chordHeading.textContent =
            "Select a major or minor scale to see its chords";
            highlightKeyboard(root, type);
        return;
    }

    chordHeading.textContent = "Chords in this key";

    chords.forEach((chord, i) => {
        const card = document.createElement("div");
        card.className = "chord-card";

        const chordNotes = [
            spelledScale[i],
            spelledScale[(i + 2) % 7],
            spelledScale[(i + 4) % 7]
        ];

        if (chord.notes.length === 4) {
            chordNotes.push(
                spelledScale[(i + 6) % 7]
            );
        }

        const title = document.createElement("h3");
        title.textContent =
            `${spelledScale[i]} ${chord.quality}`;

        const noteList = document.createElement("p");
        noteList.textContent = chordNotes.join(" - ");

        card.appendChild(title);
        card.appendChild(noteList);
        chordResults.appendChild(card);
    });
    highlightKeyboard(root, type);
}



const pianoKeyboard =
    document.getElementById("pianoKeyboard");

const blackNotes = [1, 3, 6, 8, 10];

// Build a two-octave keyboard: C4 through B5.
function createKeyboard() {
    pianoKeyboard.innerHTML = "";

    const keyWidth = 60;
    const blackWidth = 36;

    let whiteIndex = 0;

    for (let midi = 60; midi < 84; midi++) {
        const pitch = midi % 12;
        const isBlack = blackNotes.includes(pitch);

        const key = document.createElement("button");

        key.type = "button";
        key.className = isBlack
            ? "piano-key black-key"
            : "piano-key white-key";

        key.dataset.pitch = pitch;
        key.dataset.midi = midi;

        const octave = Math.floor(midi / 12) - 1;

        key.setAttribute(
            "aria-label",
            `${notes[pitch]}${octave}`
        );

        if (isBlack) {
            // Center the black key over the boundary
            // between two white keys.
            key.style.left =
                `${whiteIndex * keyWidth - blackWidth / 2}px`;
        } else {
            key.style.left =
                `${whiteIndex * keyWidth}px`;

            key.textContent = notes[pitch];

            whiteIndex++;
        }

        // Add the completed key to the keyboard.
        pianoKeyboard.appendChild(key);
    }
}

function highlightKeyboard(root, type) {
    let scale;

    if (type === "major") {
        scale = majorScale(root);
    } else if (type in minorScaleIntervals) {
        scale = minorScale(root, type);
    } else if (type in improvScaleIntervals) {
        scale = improvScale(root, type);
    } else {
        throw new Error("Unknown scale type");
    }

    const keys =
        pianoKeyboard.querySelectorAll(".piano-key");

    keys.forEach(key => {
        const pitch = Number(key.dataset.pitch);

        key.classList.remove("root", "in-scale");

        if (pitch === root) {
            key.classList.add("root");
        } else if (scale.includes(pitch)) {
            key.classList.add("in-scale");
        }
    });
}

function findMatchingChords(selected) {
    const matches = [];

    for (let root = 0; root < 12; root++) {
        for (const [type, intervals]
            of Object.entries(chordFormulas)) {

            const chordNotes = intervals.map(interval =>
                transpose(root, interval)
            );

            // Ignore octave duplicates in chord formulas.
            const uniqueNotes = new Set(chordNotes);

            const exactMatch =
                uniqueNotes.size === selected.size &&
                [...uniqueNotes].every(note =>
                    selected.has(note)
                );

            if (exactMatch) {
                matches.push({
                    root,
                    type,
                    notes: [...uniqueNotes]
                });
            }
        }
    }

    return matches;
}

function findMatchingKeys(selected) {
    const matches = [];

    for (let root = 0; root < 12; root++) {
        const scales = [
            { type: "major", notes: majorScale(root) },
            {
                type: "natural minor",
                notes: minorScale(root, "natural")
            },
            {
                type: "harmonic minor",
                notes: minorScale(root, "harmonic")
            },
            {
                type: "melodic minor",
                notes: minorScale(root, "melodic")
            }
        ];

        for (const scale of scales) {
            const containsAll =
                [...selected].every(note =>
                    scale.notes.includes(note)
                );

            if (containsAll) {
                matches.push({
                    root,
                    type: scale.type
                });
            }
        }
    }

    return matches;
}

function updateAnalysis() {
    // Highlight selected notes on the piano.
    const keys =
        pianoKeyboard.querySelectorAll(".piano-key");

    keys.forEach(key => {
        const pitch = Number(key.dataset.pitch);

        key.classList.toggle(
            "selected",
            selectedNotes.has(pitch)
        );
    });

    // Display the selected notes.
    selectedNotesDisplay.textContent =
        [...selectedNotes]
            .sort((a, b) => a - b)
            .map(pitch => notes[pitch])
            .join(" - ") || "No notes selected";

    // Identify matching chords.
    const chordMatches =
        findMatchingChords(selectedNotes);

    chordMatchesDisplay.innerHTML = "";

    if (selectedNotes.size === 0) {
        chordMatchesDisplay.textContent =
            "Select notes to identify a chord.";
    } else if (chordMatches.length === 0) {
        chordMatchesDisplay.textContent =
            "No exact chord matches found.";
    } else {
        chordMatches.forEach(chord => {
            const item = document.createElement("div");
            item.className = "analysis-result";

            item.textContent =
                `${notes[chord.root]} ${chord.type}`;

            chordMatchesDisplay.appendChild(item);
        });
    }

    // Identify possible keys.
    const keyMatches =
        selectedNotes.size > 0
            ? findMatchingKeys(selectedNotes)
            : [];

    keyMatchesDisplay.innerHTML = "";

    keyMatches.forEach(key => {
        const item = document.createElement("div");
        item.className = "analysis-result";

        const keyName = key.type === "major"
            ? majorKeyNames[key.root]
            : minorKeyNames[key.root];

        item.textContent =
            `${keyName} ${key.type}`;

        keyMatchesDisplay.appendChild(item);
    });

    if (keyMatches.length === 0) {
        keyMatchesDisplay.textContent =
            selectedNotes.size === 0
                ? "Select notes to find possible keys."
                : "No matching major or minor scales found.";
    }
}


// Update everything when the scale type changes.
scaleType.addEventListener("change", () => {
    updateKeyNames();
    displayChords();
});

// Update the results when the key changes.
keySelect.addEventListener("change", displayChords);

generateButton.addEventListener("click", displayChords);




let audioContext;

function playNote(midi) {
    if (!audioContext) {
        audioContext = new AudioContext();
    }

    const frequency =
        440 * Math.pow(2, (midi - 69) / 12);

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    const now = audioContext.currentTime;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(
        0.001, now + 0.6
    );

    oscillator.start(now);
    oscillator.stop(now + 0.6);
}
const selectedNotes = new Set();

const selectionMode =
    document.getElementById("selectionMode");

const selectedNotesDisplay =
    document.getElementById("selectedNotes");

const chordMatchesDisplay =
    document.getElementById("chordMatches");

const keyMatchesDisplay =
    document.getElementById("keyMatches");

const clearSelectionButton =
    document.getElementById("clearSelection");

function toggleSelectedNote(pitch) {
    if (selectedNotes.has(pitch)) {
        selectedNotes.delete(pitch);
    } else {
        selectedNotes.add(pitch);
    }

    updateAnalysis();
}

// Handle clicks on the keyboard.
pianoKeyboard.addEventListener("click", event => {
    const key = event.target.closest(".piano-key");

    if (!key) return;

    const midi = Number(key.dataset.midi);
    const pitch = Number(key.dataset.pitch);

    playNote(midi);

    if (selectionMode.checked) {
        toggleSelectedNote(pitch);
    }
});

clearSelectionButton.addEventListener("click", () => {
    selectedNotes.clear();
    updateAnalysis();
});

// PROGRESSION ANALYZER
// Each saved chord is a snapshot; changing the piano selection won't alter it.
const progression = [];
const addProgressionChordButton = document.getElementById("addProgressionChord");
const chordChoice = document.getElementById("progressionChordChoice");
const progressionList = document.getElementById("progressionList");
const progressionResults = document.getElementById("progressionResults");
const undoProgressionChordButton = document.getElementById("undoProgressionChord");
const clearProgressionButton = document.getElementById("clearProgression");

const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII"];

function updateChordChoice() {
    const matches = selectedNotes.size ? findMatchingChords(selectedNotes) : [];
    chordChoice.replaceChildren();
    for (const chord of matches) {
        const option = document.createElement("option");
        option.value = `${chord.root}:${chord.type}`;
        option.textContent = `${notes[chord.root]} ${chord.type}`;
        chordChoice.appendChild(option);
    }
    addProgressionChordButton.disabled = matches.length === 0;
    if (!matches.length) {
        const option = document.createElement("option");
        option.textContent = selectedNotes.size
            ? "No exact chord match — adjust selected notes"
            : "Select a chord on the piano first";
        chordChoice.appendChild(option);
    }
}

// Determine which scale degree the saved chord's root occupies.
function progressionDegree(chord, scale) {
    const index = scale.indexOf(chord.root);
    if (index === -1) return "chromatic root";
    let numeral = romanNumerals[index];
    if (["minor", "minor7", "minorMajor7"].includes(chord.type)) {
        numeral = numeral.toLowerCase();
    } else if (["diminished", "diminished7", "halfDiminished7"].includes(chord.type)) {
        numeral = numeral.toLowerCase() + "°";
    }
    return numeral;
}

// These are pitch-collection matches, not assertions about the tonal center.
function analyzeProgression(chords) {
    if (!chords.length) return [];
    const candidates = [];
    for (let root = 0; root < 12; root++) {
        const scales = [
            { name: `${majorKeyNames[root]} major`, pitches: majorScale(root) },
            { name: `${minorKeyNames[root]} natural minor`, pitches: minorScale(root, "natural") },
            { name: `${minorKeyNames[root]} harmonic minor`, pitches: minorScale(root, "harmonic") }
        ];
        for (const scale of scales) {
            const chordFits = chords.map(chord =>
                chord.pitches.every(pitch => scale.pitches.includes(pitch))
            );
            const count = chordFits.filter(Boolean).length;
            candidates.push({ ...scale, count, chordFits });
        }
    }
    return candidates.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function renderProgression() {
    progressionList.replaceChildren();
    for (const [index, chord] of progression.entries()) {
        const card = document.createElement("div");
        card.className = "progression-chord";
        const name = document.createElement("strong");
        name.textContent = `${index + 1}. ${chord.label}`;
        const pitches = document.createElement("small");
        pitches.textContent = chord.pitches.map(p => notes[p]).join(" – ");
        card.append(name, pitches);
        progressionList.appendChild(card);
    }
    undoProgressionChordButton.disabled = progression.length === 0;
    clearProgressionButton.disabled = progression.length === 0;
    progressionResults.replaceChildren();
    if (!progression.length) {
        progressionResults.textContent = "Add at least one chord to compare possible keys.";
        return;
    }
    const results = analyzeProgression(progression);
    const exact = results.filter(result => result.count === progression.length);
    const shown = exact.length ? exact : results.filter(result => result.count === results[0].count);
    const explanation = document.createElement("p");
    explanation.textContent = exact.length
        ? `These ${exact.length} scale(s) contain every note of every saved chord. This alone cannot determine the tonal center.`
        : `No tested scale contains every chord. Showing scales containing the most chords (${results[0].count} of ${progression.length}); the others may be borrowed or chromatic.`;
    progressionResults.appendChild(explanation);
    for (const result of shown) {
        const card = document.createElement("div");
        card.className = "progression-result";
        const heading = document.createElement("h4");
        heading.textContent = `${result.name} — ${result.count}/${progression.length} chords`;
        const detail = document.createElement("p");
        detail.textContent = progression.map((chord, i) =>
            `${chord.label}: ${result.chordFits[i] ? progressionDegree(chord, result.pitches) : "outside scale"}`
        ).join("  |  ");
        card.append(heading, detail);
        progressionResults.appendChild(card);
    }
}

addProgressionChordButton.addEventListener("click", () => {
    const [rootText, type] = chordChoice.value.split(":");
    if (!type || !chordFormulas[type]) return;
    const root = Number(rootText);
    const pitches = [...new Set(buildChord(root, type))];
    // Guard against stale selection or an altered dropdown.
    if (pitches.length !== selectedNotes.size ||
        !pitches.every(pitch => selectedNotes.has(pitch))) return;
    progression.push({ root, type, pitches, label: `${notes[root]} ${type}` });
    selectedNotes.clear();
    updateAnalysis();
    renderProgression();
});

undoProgressionChordButton.addEventListener("click", () => {
    progression.pop();
    renderProgression();
});
clearProgressionButton.addEventListener("click", () => {
    progression.length = 0;
    renderProgression();
});

// Keep the chord dropdown synchronized with every selection/clear action.
const previousUpdateAnalysis = updateAnalysis;
updateAnalysis = function () {
    previousUpdateAnalysis();
    updateChordChoice();
};

// All variables and listeners are ready before initialization.
createKeyboard();
updateKeyNames();
displayChords();
updateAnalysis();
renderProgression();
