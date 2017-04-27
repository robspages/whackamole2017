'use strict';
import {Mesh, MeshLambertMaterial, FontLoader, TextGeometry, Box3} from 'three';

class Score {
  constructor(scene){
    let loader = new FontLoader();
    this.mesh = {
      position: {},
      rotation: {}
    };
    this.score = 0;
    loader.load('https://api.myjson.com/bins/10cfyj', (font) => {
        this.font = font;
        let geometry = new TextGeometry(this.score, {font: this.font});
        this.material = new MeshLambertMaterial( { color : 'blue' } );
        this.mesh = new Mesh( geometry, this.material );
        this.mesh.scale.x = 5;
        this.mesh.scale.y = 5;
        this.mesh.rotation.x = 1;
        this.mesh.position.y = 3500;
        scene.add( this.mesh );
        let box = new Box3().setFromObject(this.mesh);
        this.mesh.position.x = (box.min.x - box.max.x)/2;
    })
  }
  reloadScoreboard(){
    this.mesh.geometry = new TextGeometry(this.score, {font: this.font});
    let box = new Box3().setFromObject(this.mesh);
    this.mesh.position.x = (box.min.x - box.max.x)/2;
    this.now = Date.now();
    this.mesh.rotation.z = 0;
    this.spin();
  }
  incrementScore(){
    this.score++;
    this.reloadScoreboard();
  }
  spin() {
    this.mesh.rotation.z += (Date.now() - this.now) * .0126;
    this.now = Date.now();
    if(this.mesh.rotation.z > 6.3){
      this.mesh.rotation.z = 0;
    } else {
      requestAnimationFrame(this.spin.bind(this));
    }
  }
}

export default Score;
