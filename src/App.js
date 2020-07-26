import React, {useState} from 'react';
import {MdCopyright, MdMoreVert, MdReplay} from 'react-icons/md'
import './App.css';

import Piano from './assets/piano.svg'
import Clef from './assets/clef.png'

function App() {
  const names = [
    "Unison",
    "Minor 2nd",
    "Major 2nd",
    "Minor 3rd",
    "Major 3rd",
    "Perfect 4th",
    "Diminished 5th",
    "Perfect 5th",
    "Minor 6th",
    "Major 6th",
    "Minor 7th",
    "Major 7th",
    "Perfect 8th"
  ]

  const [prevNote, setNote] = useState(0);
  const [prevBase, setBase] = useState(0);
  const [mode, setMode] = useState(0);
  const [options, setOptions] = useState([names[0], names[1], names[2]]);

  const interval = Math.abs(prevBase - prevNote);

  const [base, note] = document.getElementsByTagName('audio');
  base.src = `../notes/${prevBase}.mp3`
  note.src = `../notes/${prevNote}.mp3`;

  base.onended = () => {
    note.play()
  }
  base.onloadeddata = () => {
    play()
  }

  const play = () => {
    if (mode) {
      base.onended = () => {};
      base.play();
      note.play();
    } else {
      base.play()
    }
  }

  function replay(){
    play()
    const replayButton = document.getElementById('replay');
    replayButton.classList.add('replay')
    replayButton.onanimationend = () => {
      replayButton.classList.remove('replay')
    }
  }

  function toggleSettings(){
    const settings = document.getElementsByClassName('settings')[0];
    if (settings.className === 'settings'){
      settings.classList.add('visible-settings')
    }
    else {
      settings.classList.toggle('visible-settings');
      settings.classList.toggle('hidden-settings');
    }
  }

  function getNote(){
    const except = [...arguments]
    var value;
    do {
      value = Math.floor(Math.random() * 13)
    } while (except.indexOf(value) !== -1)

    return value;
  }
  
  async function check(){
    const buttons = document.getElementsByTagName('button');
    //Show answer
    for (let item of buttons) {
      if (item.innerHTML === names[interval]) {
        item.style.backgroundColor = '#0A0'
      } else {
        item.style.backgroundColor = "#A00"
      }
    }
    play()
    //Set new question
    setTimeout(async () => {
        for(let item of buttons){
          item.style.backgroundColor = "#000"
        }

        const newBase = getNote(prevBase);
        await setBase(newBase)

        const newNote = getNote(prevNote)
        await setNote(newNote)
        
        const newInterval = Math.abs(newBase - newNote)

        //Bad idea but should work for now
        var wrongOptions = new Array(3);

        wrongOptions[0] = getNote(newInterval, ...wrongOptions)
        wrongOptions[1] = getNote(newInterval, ...wrongOptions)
        wrongOptions[2] = getNote(newInterval, ...wrongOptions)

        var rightAnswerPos;
        do {
          rightAnswerPos = Math.floor(Math.random() * 3);
        } while (rightAnswerPos === options.indexOf(names[interval]))

        const newOptions = options.map((value, index) => {
          if(index === rightAnswerPos) {
            return names[newInterval]
          } else {
            return names[wrongOptions[index]];
          }
        })
        await setOptions(newOptions)

        play()
    }, 2000)
  }

  return (
    <div className="App">
      <header>
        <section className="header-section">
          <img src={Clef} alt="clef"/>
          HEAR
        </section>
        <section className="header-section" style={{justifyContent: 'right'}}>
          <div
            className="settings"
          >
            <p
              className={!mode && 'selected'} 
              onClick={async () => {
                await setMode(0);
                toggleSettings()
              }
            }>
              MELODIC
            </p>
            <p
              className={mode && 'selected'}
              onClick={async () => {
                await setMode(1);
                toggleSettings()
              }
            }>
              HARMONIC
            </p>
          </div>
          <MdMoreVert
            alt="settings"
            onClick={() => {toggleSettings()}}
          />
        </section>
      </header>

      <section id="visual">
        <div id='piano'>
          <img src={Piano} alt='piano'/>
        </div>
        <MdReplay
          id="replay"
          alt="Replay" 
          size={46}
          onClick={() => {replay()}}
        />
      </section>

      <section id="answer">
        <button
          className='option'
          onClick={()=> {check()}}
        >
          {options[0]}
        </button>
        <button
          className='option'
          onClick={()=> {check()}}
        >
          {options[1]}
        </button>
        <button
          className='option'
          onClick={()=> {check()}}
        >
          {options[2]}
        </button>
      </section>
      <footer>
        <a
          href="http://www.github.com/davidgoisc/hear"
          target="_blank"
          rel="noopener noreferrer"
        >
          David Gois <MdCopyright/> 2020
        </a>
      </footer>
    </div>
  );
}

export default App;