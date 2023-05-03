import React, { useState, useEffect } from 'react';
import { Chord, ChordType, Scale } from 'tonal';
import * as Tone from 'tone';
import { replaceDoubleSharps, randomOctave, getRandomNote, playNote, playNotes } from './util.js';

function RandomChordGenerator() {
	const [current, setCurrent] = useState('');
	const [minOctave, setMinOctave] = useState(4);
	const [maxOctave, setMaxOctave] = useState(4);
	const [scale, setScale] = useState('C');
	const [numNotes, setNumNotes] = useState(16); // Number of notes to play in sequence
	const [boolSeq, setBoolSeq] = useState(0); // Whether a sequence is currently playing
	let [countSim, setCountSim] = useState(0); // Current number of chords playing simultaneously

	useEffect(() => {
		console.log("Scale: " + scale);
		console.log([1, 2, 3, 4, 5, 6, 7].map(Scale.degrees(scale + " major")));
	  }, [scale]);

  	const generateRandomNote = (dur) => {
		console.log(dur);
		// define an array of notes to choose from
		// const notes = ["C", "D", "E", "F", "G", "A", "B"];
		const notes = [1, 2, 3, 4, 5, 6, 7].map(Scale.degrees(scale + " major"));

		// choose a random note from the array
		const randomNote = notes[Math.floor(Math.random() * notes.length)];

		const oct = randomOctave(maxOctave, minOctave);

		setCurrent(randomNote + oct);
		// play the random note for one second
		playNote(randomNote, oct, dur);
  	};

  	const generateChord = async () => {


		if (countSim > 0) {
			return;
		}

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

		console.log(countSim);
		setCountSim(++countSim);
		console.log(countSim);

		console.log(`The notes are ${modifiedNotes}`);
	
		setCurrent(modifiedNotes.join(", "));
		// play the chord for one second
		playNotes(modifiedNotes, "0.5");

		await new Promise(resolve => setTimeout(resolve, 250));
		setCountSim(--countSim);
		console.log(countSim);
  	};

	const generateSequence = async (num) => {
		if (boolSeq === 1) {
			return;
		}
		
		setBoolSeq(1);

		const sequence = [];

		for (let i = 0; i < num; i++) {
			const pause = Math.random() < 0.5 ? '0.25' : '0.5';
			await new Promise(resolve => setTimeout(resolve, parseFloat(pause) * 1000));
		  	sequence.push(generateRandomNote("0.25"));
		}

		setBoolSeq(0);

		return sequence;
	}
	  

  	const handleMinOctaveChange = (event) => {
    	setMinOctave(Number(event.target.value));
  	};

  	const handleMaxOctaveChange = (event) => {
    	setMaxOctave(Number(event.target.value));
  	};

	const handleNumNotesChange = (event) => {
		setNumNotes(Number(event.target.value));
	}

	const handleScaleChange = (event) => {
    	setScale(event.target.value);
  	};

  	const octaveOptions = Array.from({ length: 8 }, (_, index) => (
		<option key={index} value={index + 1}>
		{index + 1}
		</option>
	));
  

  	return (
	<div className="flex flex-col items-start h-screen">
		<div className="flex flex-row items-start w-screen">
		<div className="flex flex-col items-center justify-center bg-gradient-to-b from-gray-300 to-gray-200 rounded-lg shadow-lg mt-8 mr-8 p-8" style={{width: "20%"}}>		
			<div className="flex flex-row items-center justify-between w-full mb-4">
				<label htmlFor="minOctave" className="mr-4">Min Octave:</label>
				<select id="minOctave" name="minOctave" value={minOctave} onChange={handleMinOctaveChange} className="border border-gray-400 rounded-md py-1 px-2">
					{octaveOptions}
				</select>
			</div>
			<div className="flex flex-row items-center justify-between w-full mb-4">
				<label htmlFor="maxOctave" className="mr-4">Max Octave:</label>
				<select id="maxOctave" name="maxOctave" value={maxOctave} onChange={handleMaxOctaveChange} className="border border-gray-400 rounded-md py-1 px-2">
					{octaveOptions}
				</select>
			</div>
			<div className="flex flex-row items-center justify-between w-full mb-4">
				<label htmlFor="scale" className="mr-4">Scale:</label>
				<select id="scale" name="scale" value={scale} onChange={handleScaleChange} className="border border-gray-400 rounded-md py-1 px-2">
					{['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'Cb'].map((value, index) => (
					<option key={index} value={value}>{value}</option>
					))}
				</select>
			</div>

		</div>

		<div className="flex flex-col items-center justify-center bg-gradient-to-b from-gray-300 to-gray-200 rounded-lg shadow-lg mt-8 p-8" style={{width: "20%"}}>		

		<label htmlFor="num-notes-select">Number of notes:</label>
		<select id="num-notes-select" value={numNotes} onChange={handleNumNotesChange}>
			<option value={8}>8</option>
			<option value={16}>16</option>
			<option value={32}>32</option>
			<option value={64}>64</option>
		</select>
		</div>
		</div>


		<div className="flex flex-row items-center justify-center bg-gradient-to-b from-gray-300 to-gray-200 rounded-lg shadow-lg p-8 mt-6" style={{width: "50%"}}>
			<button onClick={() => generateRandomNote("0.25")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mr-2">Generate Random Note</button>
			<button onClick={generateChord} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mr-2">Generate Random Chord</button>
			<button onClick={() => generateSequence(numNotes)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Generate Sequence</button>
		</div>
	</div>
  	);
}

export default RandomChordGenerator;

