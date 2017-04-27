'use strict';
import {Mesh, MeshLambertMaterial, FontLoader, TextGeometry, Box3} from 'three';

class Timer {
  constructor(scene, $domElement, $startGame, score, highscore){
    let loader = new FontLoader();
    this.firstGame = true;
    this.mesh = {
      position: {},
      rotation: {}
    };
    this.$domElement = $domElement;
    this.$startGame = $startGame;
    this.timeLeft = 0;
    this.score = score;
    this.highscore = highscore;
    loader.load('https://api.myjson.com/bins/10cfyj', (font) => {
        this.font = font;
        let geometry = new TextGeometry(this.timeLeft, {font: this.font});
        this.material = new MeshLambertMaterial( { color : 'blue' } );
        this.mesh = new Mesh( geometry, this.material );
        this.mesh.scale.x = 5;
        this.mesh.scale.y = 5;
        this.mesh.rotation.x = 1;
        this.mesh.position.y = 3500;
        this.mesh.position.x = -3500;
        scene.add( this.mesh );
        this.tickDown();
    });
  }
  redrawTime(){
    this.mesh.geometry = new TextGeometry(this.timeLeft, {font: this.font});
  }
  showMenu(){
    this.$domElement.css({cursor: 'default'});
    this.$startGame.parent().show();
    this.highscore.showHighScores();
  }
  tickDown(){
    this.now = this.now || Date.now();
    if(Date.now() - this.now >= 1000){
      this.timeLeft--;
      this.now = Date.now();
      this.redrawTime();
    }
    if(this.timeLeft > 0){
      requestAnimationFrame(this.tickDown.bind(this));
    } else {
      if(!this.firstGame){
        this.$domElement.css({cursor: 'default'});
        let newHighScore = this.highscore.checkHighScore(this.score);
        if(newHighScore){
          this.highscore.showNewHighScore(newHighScore);
        } else {
          this.$startGame.parent().show();
        }
        this.highscore.showHighScores();
        this.now = null;
      }
      this.firstGame = false;
    }
  }
}

export default Timer;
