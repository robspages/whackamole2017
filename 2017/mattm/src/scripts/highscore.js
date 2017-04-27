'use strict';
import $ from 'jquery';
import {Mesh, MeshLambertMaterial, FontLoader, TextGeometry, Box3} from 'three';

class HighScore {
  constructor(scene){
    this.getHighScores();
    this.$highScoreForm = $('#highScoreForm');
    this.placeAndScore = null;
    this.$highScoreForm.find('button').on('click', () => {
      let initials = this.$highScoreForm.find('input').val()
      if(this.placeAndScore && initials){
        this.$highScoreForm.hide();
        this.newHighScore(this.placeAndScore[0], this.placeAndScore[1], initials);
        this.timer.showMenu();
      }
    });
    this.$highScoreForm.hide();
    if(!this.highscores){
      this.populateDefaultHighScores();
      this.saveHighScores();
    }
    this.scene = scene;
    let loader = new FontLoader();
    this.mesh = {
      position: {},
      rotation: {}
    };
    loader.load('https://api.myjson.com/bins/10cfyj', (font) => {
        this.font = font;
        let geometry = new TextGeometry(this.highScoreAsText(), {font: this.font});
        this.material = new MeshLambertMaterial( { color : 'grey' } );
        this.mesh = new Mesh( geometry, this.material );
        this.mesh.scale.x = 3;
        this.mesh.scale.y = 3;
        this.mesh.rotation.x = 1;
        this.mesh.position.x = 1600;
        this.mesh.position.y = 300;
         if(!this.hidden){
          this.showHighScores();
        }
        window.highscore = this.mesh 
    })
  }
  hideHighScores(){
    this.hidden = true;
    this.scene.remove( this.mesh );
  }
  showHighScores(){
    this.hidden = false;
    this.mesh.geometry = new TextGeometry(this.highScoreAsText(), {font: this.font});
    this.mesh.position.x = 1600;
    this.scene.add( this.mesh );
    this.moveHighScore();
  }
  highScoreAsText(){
    return this.highscores.map((highscore, i) => `${i+1}: ${highscore.name} - ${highscore.score}`).join('|');
  }
  populateDefaultHighScores(){
    let defaultName = "AAA";
    let scores = [50, 45, 40, 35, 30, 25, 20, 15, 10, 5]
    this.highscores = [];
    for(let score of scores){
      this.highscores.push({name: defaultName, score: score});
    }
  }
  getHighScores(){
     this.highscores = JSON.parse(localStorage.getItem('highscores'));
  }
  saveHighScores(){
    localStorage.setItem('highscores', JSON.stringify(this.highscores));
  }
  moveHighScore(){
    this.now = this.now || Date.now();
    let box = new Box3().setFromObject(this.mesh);
    if(box.max.x < -1600){
      this.mesh.position.x = 1600;
    }
    this.mesh.position.x -= (Date.now() - this.now) * .50;
    this.now = Date.now();
    requestAnimationFrame(this.moveHighScore.bind(this));
  }
  checkHighScore(score){
    let scores = this.highscores.map((highscore) => highscore.score);
    let lowestScore = scores[scores.length -1];
    if(score.score > lowestScore){
      scores.push(score.score);
      scores = scores.sort((a, b) => (b- a))
      let i = scores.lastIndexOf(score.score);
      return [i, score.score];
    }
    return false;
  }
  showNewHighScore(placeAndScore){
    this.placeAndScore = placeAndScore;
    this.$highScoreForm.show();
  }
  newHighScore(loc, score, name){
    this.highscores.splice(loc, 0, {name: name, score});
    this.highscores.pop();
    this.saveHighScores();
  }
}

export default HighScore;
