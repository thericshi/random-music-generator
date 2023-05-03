import React, { useState, useEffect } from 'react';
import { Chord, ChordType, Scale } from 'tonal';
import * as Tone from 'tone';

function RandomChordGenerator() {
	const [current, setCurrent] = useState('');
	const [minOctave, setMinOctave] = useState(4);
	const [maxOctave, setMaxOctave] = useState(4);
	const [scale, setScale] = useState('C');

	useEffect(() => {
		console.log("Scale: " + scale);
		console.log([1, 2, 3, 4, 5, 6, 7].map(Scale.degrees(scale + " major")));
	  }, [scale]);

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
		setCurrent(note + octave);
  	}

  	const playNotes = (notes, duration) => {
		const synth = new Tone.PolySynth().toDestination();
		synth.volume.value = -4;
		synth.triggerAttackRelease(notes, duration);
		setCurrent(notes.join(", "));
  	}

  	const generateRandomNote = (dur) => {
		console.log(dur);
		// define an array of notes to choose from
		// const notes = ["C", "D", "E", "F", "G", "A", "B"];
		const notes = [1, 2, 3, 4, 5, 6, 7].map(Scale.degrees(scale + " major"));

		// choose a random note from the array
		const randomNote = notes[Math.floor(Math.random() * notes.length)];

		// play the random note for one second
		playNote(randomNote, randomOctave(maxOctave, minOctave), dur);
  	};

  	const generateChord = () => {

		const scaleNotes = [1, 2, 3, 4, 5, 6, 7].map(Scale.degrees(scale + " major"));

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

		console.log(repNotes);
		console.log(scaleNotes);
		if (!repNotes.every(val => scaleNotes.includes(val))) {
			generateChord();
			return;
		}

		const octave = randomOctave(maxOctave, minOctave);
		const modifiedNotes = repNotes.map(note => note + octave);

		console.log(`The notes are ${modifiedNotes}`);
	
		// play the chord for one second
		playNotes(modifiedNotes, "0.25");
  	};

	const generateSequence = async (num) => {
		const sequence = [];

		for (let i = 0; i < num; i++) {
			const pause = Math.random() < 0.5 ? '0.25' : '0.5';
			await new Promise(resolve => setTimeout(resolve, parseFloat(pause) * 1000));
		  	sequence.push(generateRandomNote("0.25"));
		}

		return sequence;
	}
	  

  	const handleMinOctaveChange = (event) => {
    	setMinOctave(Number(event.target.value));
  	};

  	const handleMaxOctaveChange = (event) => {
    	setMaxOctave(Number(event.target.value));
  	};

	const handleScaleChange = (event) => {
    	setScale(event.target.value);
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
    <div>
        <label htmlFor="scale">Scale:</label>
        <select id="scale" name="scale" value={scale} onChange={handleScaleChange}>
			<option value="C">C</option>
			<option value="Db">Db</option>
			<option value="D">D</option>
			<option value="Eb">Eb</option>
			<option value="E">E</option>
			<option value="F">F</option>
			<option value="Gb">Gb</option>
			<option value="G">G</option>
			<option value="Ab">Ab</option>
			<option value="A">A</option>
			<option value="Bb">Bb</option>
			<option value="Cb">Cb</option>
        </select>
    </div>
    <button onClick={() => generateRandomNote("0.25")}>Generate Random Note</button>
    <button onClick={generateChord}>Generate Random Chord</button>
	<button onClick={() => generateSequence("16")}>Generate Sequence</button>
    <p>{current}</p>
</div>

  	);
}

export default RandomChordGenerator;

