'use strict';
import $ from 'jquery';
import HammerTime from './hammerTime.js';
import Platform from './platform.js';
import Mole from './mole.js';
import Score from './score.js';
import HighScore from './highscore.js'
import Timer from './timer.js';
import {Scene, DirectionalLight, Color, PerspectiveCamera, BoxGeometry, WebGLRenderer} from 'three';

let scene = new Scene();
let mole = new Mole(scene);
let platform = new Platform( scene );
let score = new Score( scene );
let highscore = new HighScore( scene );
let hammerTime = new HammerTime(scene, mole, score);


let camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
camera.position.z = 1000;
camera.rotation.x = .8;

let light = new DirectionalLight( 0xffffff );
light.position.set( camera.position.x, camera.position.y, camera.position.z ).normalize();
scene.add( light );


scene.background = new Color( 'lightblue' );

let renderer = new  WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );

let $domElement = $(renderer.domElement)
let $startGame = $('#startGame');
let $hammerColor = $('#hammerColor');
let timer = new Timer( scene, $domElement, $startGame, score, highscore );
highscore.timer = timer;

$startGame.on('click', () => {
  $startGame.parent().hide();
  $domElement.css({cursor: 'none'});
  highscore.hideHighScores();
  if(score.score != 0) {
    score.score = 0;
    score.reloadScoreboard();
  }
  timer.timeLeft = 60;
  timer.tickDown();
});

$hammerColor.on('click', () => {
  hammerTime.changeColor();
})

$domElement.on('mousemove', (event) => {
  if(timer.timeLeft > 0) { 
    hammerTime.move(event, $domElement);
  }
});

$domElement.on('click', (event) =>{
  if(!hammerTime.rotating && timer.timeLeft > 0){
    hammerTime.back = true;
    hammerTime.rotate();
  };
});


function animate() {
  requestAnimationFrame( animate );
  mole.move();
  renderer.setSize( window.innerWidth, window.innerHeight);
  renderer.render( scene, camera );
}

animate();
