const notes = [
    "c", "C#", "D", "D#", "E", "F", 
    "F#", "G", "G#", "A", "A#", "B"
];

console.log(notes[0]); // C
console.log(notes[4]); // E
console.log(notes[7]); // G

function transpose(note, semitones) {
    return ((note + semitones) % 12 + 12) % 12;
}

console.log(notes[transpose(0,7)]); // G
console.log(notes[transpose(9,7)]); // E
console.log(notes[transpose(0,-2)]); // A#

function majorChord(root){
    const third = transpose(root, 4);
    const fifth = transpose(root, 7);

    return [root, third, fifth];
}

const chord = majorChord(2);

console.log(chord.map(note => notes[note]));
// ["D", "F#", "A"]

function minorChord(root){
    const third = transpose(root, 3);
    const fifth = transpose(root, 7);

    return [root, third, fifth];
}

const chordm = minorChord(9);
console.log(chordm.map(note => notes[note]));