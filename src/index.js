import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

let targetWord = "";

const root = ReactDOM.createRoot(document.getElementById('root'));

let lastIndex = 0;
let word = "";
let wordIndex = 0;
let finished = false;

const Cell = ({state, value}) => {
  return(
      <div className={`cell _${state}`}>
          <h2 className='letter'>{value}</h2>
      </div>
  )
}

async function SetTargetWord() {
  const response = await fetch("output.txt");
  const data = await response.text();
  const words = data.split('\n').map(word => word.trim());

  const randomIndex = Math.floor(Math.random() * words.length);
  console.log(randomIndex);
  targetWord = words[randomIndex].toUpperCase();
}

await SetTargetWord();

//targetWord = "VEČER";

console.log("word: " + targetWord);

let cells = [];
let letters = [];
let showWord = false;
CreateWordleBoard();
WordleBoard();

/*
STATES OF CELLS
0 - empty
1 - with letter, not guessed
2 - guessed incorrectly (red)
3 - guessed incorrectly space, correctly letter (yellow)
4 - guessed correctly (green)
*/
function CreateWordleBoard(){
  for(let i = 0; i < 5; i++){
    for(let j = 0; j < 6; j++){
      cells.push(
        <Cell state = {0} value = {''}/>
      );
    }
  }
}

function WordleBoard(){
  return(
    <div className='board'>
      {cells}
    </div>
  )

}

async function CheckIfWordExists(wordG){
  const response = await fetch("output.txt");
  const data = await response.text();
  const words = data.split('\n').map(word => word.trim());
  
  console.log("length: " + words.length);
  console.log(wordG.toUpperCase().trim())
  for (let i = 0; i < words.length; i++) {
    //console.log(words[i] + " - " + words[i].length);
    if(words[i].toUpperCase().trim() == wordG.toUpperCase().trim()){
      return true;
    }
  }
  return false;
}

let numberOfGreens = 0;
function ColorCells(word, wordIndex){
  numberOfGreens = 0;
  for(let i = 0; i < 5; i++){
    const value = letters[(wordIndex * 5) + i]
    console.log("value: " + value)
    if(word[i] == targetWord[i]){
      cells[(wordIndex * 5) + i] = <Cell state = {4} value = {value}/>
      numberOfGreens++;
    }
    else if(targetWord.includes(word[i])){
      cells[(wordIndex * 5) + i] = <Cell state = {3} value = {value}/>
    }
    else{
      cells[(wordIndex * 5) + i] = <Cell state = {2} value = {value}/>
    }
  }
  if(numberOfGreens == 5){
    finished = true;
  }
  root.render(<WordleBoard/>);
}

async function handleKeyDown(event) {
  if(finished){
    return;
  }
  else if(!(wordIndex < 6) || event.key == " "){

  }
  else if (event.key === 'Enter' && word.length == 5) {
    console.log("target word: " + targetWord);
    const isValid = await CheckIfWordExists(word);
    if(!isValid){
      return;
    }
    console.log("guess word: " + targetWord);
    ColorCells(word, wordIndex);
    
    wordIndex++;
    if(wordIndex == 6 && word.toUpperCase() != targetWord.toUpperCase()){
      showWord = true;
    }
    lastIndex = 0;
    word = "";
    if(wordIndex == 6){
      finished = true;
      if(showWord == true){
        alert("The word was: " + targetWord);
      }
    }
  }
  else if(event.key == "Backspace"){
    if(lastIndex != 0){
      lastIndex--;
      cells[(wordIndex * 5) + lastIndex ] = <Cell state = {0} value = {""}/>
      word = word.slice(0, lastIndex);
    }
  }
  else if(event.key.length > 1){

  }
  else if(word.length < 5){
    word = word + event.key;
    word = word.toUpperCase();
    cells[(wordIndex * 5) + lastIndex] = <Cell state = {1} value = {event.key.toUpperCase()}/>
    letters[(wordIndex * 5) + lastIndex] = event.key.toUpperCase();
    console.log("letter: " + letters[(wordIndex * 5) + lastIndex]);
    lastIndex++;
  }

  root.render(<WordleBoard/>);
}

document.addEventListener("keydown", handleKeyDown);

root.render(<WordleBoard/>);
