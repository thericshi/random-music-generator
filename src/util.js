import { Chord, ChordType, Scale } from 'tonal';
import * as Tone from 'tone';

export function replaceDoubleSharps(notes) {
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

export function randomOctave(max, min) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getRandomNote() {
  const notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  const randomIndex = Math.floor(Math.random() * notes.length);
  return notes[randomIndex];
}

export function playNote(note, octave, duration) {
  const synth = new Tone.Synth().toDestination();
  console.log(note + octave);
  synth.triggerAttackRelease(note + octave, duration);
}

export function playNotes(notes, duration) {
  const synth = new Tone.PolySynth().toDestination();
  synth.volume.value = -4;
  synth.triggerAttackRelease(notes, duration);
}