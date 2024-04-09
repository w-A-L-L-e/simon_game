// ========================== Simon Game ======================
// Author: Walter Schreppers
// About: Written during my holiday for Noah Schreppers my son
// who liked the game and wanted to play it on his tablet.
// The existing apps in appstore all had anoying adds so rick rolled
// a quick vanilla js version of my own.
//

let seq = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0 
];

let seq_len = 0;
let click_count = 0;
let speed = 1200;
let wait_for_clicks = true;
let playing = false;
let allow_clicking = false;

async function play_sound(mp3_file){
  console.log("playing ", mp3_file);
  var audio = new Audio("assets/" + mp3_file);
  audio.volume = 0.9;
  audio.play();
}


function rand() {
  return Math.floor(Math.random()*4) + 1;
}


async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('done');
    }, ms);
  });
}


function initSequence() {
  for( let i=0; i < seq.length; i++ ) {
    seq[i] = rand();
  }
  console.log("simon game sequence=", seq);
}


function setButton(div_id, led_on){
  let btn_div = document.getElementById(div_id);
  if (!btn_div) return;

  if(led_on) {
    btn_div.classList.add("active");
  } 
  else{
    btn_div.classList.remove("active");
  }
}


async function blink(pos, speed=2000){
  if (speed>2000) speed = 1500;

  let blink_ms = 2100 - speed;
  let div_id = "btn"+pos;

  play_sound(pos+".mp3");

  // btn on
  setButton(div_id, true);

  // btn off
  setTimeout(()=>{
    setButton(div_id, false);
  }, blink_ms-100);


  await sleep(blink_ms);
}


function showDiv(div_id){
  let div = document.getElementById(div_id);
  div.style.display = "block";
}


function hideDiv(div_id){
  let div = document.getElementById(div_id);
  div.style.display = "none";
}


function showScore(){
  let score = seq_len - 1;
  if (score<0) score = 0;

  let btn = document.getElementById("start_button");
  btn.innerHTML = "SCORE: " + score;
}


function showStart(){
   let btn = document.getElementById("start_button");
  btn.innerHTML = "START";
}


function restartGame(){
  click_count = 0;
  initSequence();
  seq_len = 1;
  wait_for_clicks = false;
}

async function youFailed(){
  console.log("YOU FAILED");
  showDiv("bad_click");
  play_sound("bang.mp3");

  setTimeout(()=>{hideDiv("bad_click");}, 1500);
  await sleep(2500);

  restartGame(); 
}


async function buttonClick(pos){
  if (seq_len == 0) {
    startClicked();
    return;
  }

  if (!allow_clicking) return;
  allow_clicking = false;

  await blink(pos, 1800);

  if (seq[click_count] == pos) {
    console.log("correct click!");
    click_count++;

    if (click_count >= seq_len) {
      seq_len++;
      showScore();
      await sleep(1000);
      click_count = 0;
      wait_for_clicks = false;
    }
  }
  else {
    await youFailed();
    showScore();
  }

  allow_clicking = true;
}

function startClicked(){
  if(playing) return;

  showScore();

  playing = true;
  restartGame();
}


async function loop(){
  if (wait_for_clicks || seq_len == 0) return;

  wait_for_clicks = true;
  allow_clicking = false;
  for(let pos = 0; pos < seq_len; pos++) {
    await blink(seq[pos], speed);
    await sleep(200); // pauze between blinks
  }
  allow_clicking = true;
}


async function main(){
  showStart();
  restartGame();
  seq_len = 0; // first make user click something

  setInterval(()=>{
    loop();
  }, 500);
}

// normally do this on some dom ready event
// however for this simple page just loading the js at end also works here
main();
