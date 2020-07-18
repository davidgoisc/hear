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
    "Dimished 5th",
    "Perfect 5th",
    "Minor 6th",
    "Major 6th",
    "Minor 7th",
    "Major 7th",
    "Perfect 8th"
  ]

  const [prevNote, setNote] = useState(0);
  const [base, note] = document.getElementsByTagName('audio');
  const [options, setOptions] = useState([names[0], names[1], names[2]]);

  base.src = '../notes/0.mp3'
  note.src = `../notes/${prevNote}.mp3`;
  base.onended = () => {
    note.play()
  }
  base.onloadeddata = () => {
    play()
  }

  var play = () => {
    base.play()
  }
  //Why isn't this working?
  function harmonic(){
    base.onended = () => {}
    play = () => {
      base.play();
      note.play()
    }
    toggleSettings();
  }

  function melodic(){
    base.onended = () => {
      note.play()
    }
    play = () => {
      base.play();
    }
    toggleSettings();
  }

  function toggleSettings(){
    const vis = document.getElementById('settings').style;
    if (vis.visibility === 'visible') {
      vis.visibility = 'hidden';
    } else {
      vis.visibility = 'visible';
    }
  }

  function getRandomNote(){
    return Math.floor(Math.random() * 13)
  }

  async function check(option){
    const buttons = document.getElementsByTagName('button');
    //Show answers
    for (let item of buttons) {
      if (item.innerHTML === names[prevNote]) {
        item.style.backgroundColor = '#0A0'
      } else {
        item.style.backgroundColor = "#A00"
      }
    }
    play()

    setTimeout(async () => {
        for(let item of buttons){
          item.style.backgroundColor = "#000"
        }
        var tone;
        do {
          tone = getRandomNote()
        } while (tone === prevNote)
        await setNote(tone)

        //Bad idea but should wotrk for now
        var wrongOptions = new Array(3);
        do {
          wrongOptions[0] = getRandomNote();
        } while (wrongOptions[0] === tone)

        do {
          wrongOptions[1] = getRandomNote();
        } while (wrongOptions[1] === tone || wrongOptions[1] === wrongOptions[0])

        do {
          wrongOptions[2] = getRandomNote();
        } while (wrongOptions[2] === tone || wrongOptions[2] === wrongOptions[0] || wrongOptions[2] === wrongOptions[1])

        var rightAnswerPos;
        do{
          rightAnswerPos = Math.floor(Math.random() * 3);
        } while (rightAnswerPos === options.indexOf(names[prevNote]))

        const newOptions = options.map((value, index) => {
          if(index === rightAnswerPos) {
            return names[tone]
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
        <section className="logo">
          <img src={Clef} alt="clef"/>
          HEAR
        </section>
        <section>
          <div id="settings">
            <p onClick={()=>{melodic()}}>MELODIC</p>
            <p onClick={()=>{harmonic()}}>HARMONIC</p>
          </div>
          <MdMoreVert
            onClick={() => {toggleSettings()}}
          />
        </section>
      </header>

      <section id="visual">
        <img id='piano' src={Piano} alt='piano'/>
        <MdReplay alt="Replay" size={46} onClick={() => {play()}}/>
      </section>

      <section id="answer">
        <button
          className='option'
          onClick={()=> {check(names.indexOf(options[0]))}}
        >
          {options[0]}
        </button>
        <button
          className='option'
          onClick={()=> {check(names.indexOf(options[1]))}}
        >
          {options[1]}
        </button>
        <button
          className='option'
          onClick={()=> {check(names.indexOf(options[2]))}}
        >
          {options[2]}
        </button>
      </section>
      <footer>
        <p>
          David Gois <MdCopyright/> 2020
        </p>
      </footer>
    </div>
  );
}

export default App;
