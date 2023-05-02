import React, { useState } from 'react';
import { Chord, ChordType } from 'tonal';
import * as Tone from 'tone';

function RandomChordGenerator() {
	const [chord, setChord] = useState('');
	const [minOctave, setMinOctave] = useState(4);
	const [maxOctave, setMaxOctave] = useState(4);

  	const replaceDoubleSharps = (notes) => {
    	const noteMap = {
			'C##': 'D',
			'D##': 'E',
			'E##': 'F',
			'F##': 'G',
			'G##': 'A',
			'A##': 'B',
			'B##': 'C'
    	};

    for (let i = 0; i < notes.length; i++) {
      	if (noteMap[notes[i]]) {
        	notes[i] = noteMap[notes[i]];
      	}
    }
    return notes;
}

  	const randomOctave = (max, min) => {
    	return Math.floor(Math.random() * (max - min + 1) + min);
  	};
  
  	const getRandomNote = () => {
    	const notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
    	const randomIndex = Math.floor(Math.random() * notes.length);
    	return notes[randomIndex];
  	}  

  	const playNote = (note, octave, duration) => {
		const synth = new Tone.Synth().toDestination();
		console.log(note + octave);
		synth.triggerAttackRelease(note + octave, duration);
  	}

  	const playNotes = (notes, duration) => {
		const synth = new Tone.PolySynth().toDestination();
		synth.triggerAttackRelease(notes, duration);
		setChord(notes.join(", "));
  	}

  	const generateRandomNote = () => {
		// define an array of notes to choose from
		const notes = ["C", "D", "E", "F", "G", "A", "B"];

		// choose a random note from the array
		const randomNote = notes[Math.floor(Math.random() * notes.length)];

		// play the random note for one second
		playNote(randomNote, randomOctave(maxOctave, minOctave), "1");
  	};

  	const generateChord = () => {

		const chordSymbols = ChordType.symbols();
		const randomChordSymbol = chordSymbols[Math.floor(Math.random() * chordSymbols.length)];
		const rootNote = getRandomNote();

		console.log(randomChordSymbol);
		const tonalNotes = Chord.get(`${rootNote}${randomChordSymbol}`).notes;
		if (tonalNotes.length > 3 || tonalNotes.length < 2) {
		generateChord();
		return;
		}
		const repNotes = replaceDoubleSharps(tonalNotes);
		const octave = randomOctave(maxOctave, minOctave);
		const modifiedNotes = repNotes.map(note => note + octave);

		console.log(`The notes are ${modifiedNotes}`);
	
		// play the chord for one second
		playNotes(modifiedNotes, "1");
  	};

  	const handleMinOctaveChange = (event) => {
    	setMinOctave(Number(event.target.value));
  	};

  	const handleMaxOctaveChange = (event) => {
    	setMaxOctave(Number(event.target.value));
  	};

  	const octaveOptions = Array.from({ length: 8 }, (_, index) => (
		<option key={index} value={index + 1}>
		{index + 1}
		</option>
	));
  

  	return (
    	<div>
    		<div>
    			<label htmlFor="minOctave">Min Octave:</label>
    			<select id="minOctave" name="minOctave" value={minOctave} onChange={handleMinOctaveChange}>
    			{octaveOptions}
    			</select>
    		</div>
    		<div>
				<label htmlFor="maxOctave">Max Octave:</label>
				<select id="maxOctave" name="maxOctave" value={maxOctave} onChange={handleMaxOctaveChange}>
				{octaveOptions}
				</select>
    		</div>
			<button onClick={generateRandomNote}>Generate Random Note</button>
			<button onClick={generateChord}>Generate Random Chord</button>
			<p>{chord}</p>
    	</div>
  	);
}

export default RandomChordGenerator;

