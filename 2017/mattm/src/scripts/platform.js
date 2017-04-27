'use strict';
import {BoxGeometry, MeshLambertMaterial, Mesh} from 'three';

class Platform {
  constructor(scene){
    let geometry = new BoxGeometry(10000, 10000, 200);
    let material = new MeshLambertMaterial( { color: 'green' } );

    this.platform = new Mesh( geometry, material );
    scene.add( this.platform );


    this.platform.position.z = -500;
  }
}

export default Platform;
