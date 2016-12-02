import React from 'react'

import ImprovedNoise from './improvedNoise'

import './background.less'

import * as THREE from 'three'

const INIT_DELAY_MS = 1500

const CLEAR_COLOR_RGB = 0x224466

const START_POS_Y = -5000
const END_POS_Y = 0

const TERRAIN_WIDTH = 256
const TERRAIN_DEPTH = 256

class Background extends React.Component {

  constructor() {
    super()
    this._heightData = null
    this._scene = null      // Three.js Scene instance
    this._sceneData = null  // Scene data from file
    this._camera = null
    this._renderer = null

    this._currY = START_POS_Y

    setTimeout(this._init.bind(this), INIT_DELAY_MS)
  }

  _generateTexture( data, width, height ) {
		var canvas, canvasScaled, context, image, imageData,
		level, diff, vector3, sun, shade;

		vector3 = new THREE.Vector3( 0, 0, 0 );

		sun = new THREE.Vector3( 1, 1, 1 );
		sun.normalize();

		canvas = document.createElement( 'canvas' );
		canvas.width = width;
		canvas.height = height;

		context = canvas.getContext( '2d' );
		context.fillStyle = '#000';
		context.fillRect( 0, 0, width, height );

		image = context.getImageData( 0, 0, canvas.width, canvas.height );
		imageData = image.data;

		for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {

			vector3.x = data[ j - 2 ] - data[ j + 2 ];
			vector3.y = 2;
			vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
			vector3.normalize();

			shade = vector3.dot( sun );

      // values derived from #224466
      imageData[ i ] = ( 34 + shade * 128 )// * ( 0.5 + data[ j ] * 0.007 );
      imageData[ i + 1 ] = ( 68 + shade * 128 )// * ( 0.5 + data[ j ] * 0.007 );
      imageData[ i + 2 ] = ( 102 + shade * 128 )// * ( 0.5 + data[ j ] * 0.007 );

      // imageData[ i ] = ( 96 + shade * 128 ) * ( 0.5 + data[ j ] * 0.007 );
      // imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
      // imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
		}

		context.putImageData( image, 0, 0 );

		// Scaled 4x

		canvasScaled = document.createElement( 'canvas' );
		canvasScaled.width = width * 4;
		canvasScaled.height = height * 4;

		context = canvasScaled.getContext( '2d' );
		context.scale( 4, 4 );
		context.drawImage( canvas, 0, 0 );

		image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
		imageData = image.data;

		for ( var i = 0, l = imageData.length; i < l; i += 4 ) {

			var v = ~~ ( Math.random() * 5 );

			imageData[ i ] += v;
			imageData[ i + 1 ] += v;
			imageData[ i + 2 ] += v;

		}

		context.putImageData( image, 0, 0 );

		return canvasScaled;

	}

  _generateHeight(width, height) {
		const size = width * height
    const data = new Uint16Array(size)
		const perlin = new ImprovedNoise()
    var quality = 1
    const z = Math.random() * 100

    const center = TERRAIN_WIDTH / 2
    const maxDist = Math.sqrt(2 * Math.pow(center, 2))

		for ( var j = 0; j < 4; j ++ ) {
			for ( var i = 0; i < size; i ++ ) {
				const x = i % width
        const y = ~~ ( i / width )
				data[ i ] += Math.abs(perlin.noise( x / quality, y / quality, z ) * quality * 1.75)
			}
			quality *= 5;
		}

    for ( var i = 0; i < size; i ++ ) {
      const x = i % width
      const y = ~~ ( i / width )
      const distFromCenter = Math.sqrt(Math.pow(center - x, 2) + Math.pow(center - y, 2))
      const distDelta = Math.max((maxDist - distFromCenter) / maxDist, 0) * 350
      data[i] += distDelta
    }

		return data;
	}

  _createMesh() {
    this._heightData = this._generateHeight(TERRAIN_WIDTH, TERRAIN_DEPTH)
    const geometry = new THREE.PlaneBufferGeometry( 7500, 7500, TERRAIN_WIDTH - 1, TERRAIN_DEPTH - 1 )
    geometry.rotateX(-Math.PI/2)
    const vertices = geometry.attributes.position.array;
		for ( let i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
			vertices[ j + 1 ] = this._heightData[ i ] * 15;
		}
    const texture = new THREE.CanvasTexture(this._generateTexture( this._heightData, TERRAIN_WIDTH, TERRAIN_DEPTH ))
		texture.wrapS = THREE.ClampToEdgeWrapping
		texture.wrapT = THREE.ClampToEdgeWrapping

    const material = new THREE.MeshBasicMaterial({ map: texture })

    const mesh = new THREE.Mesh(geometry, material)
    return mesh
  }

  _transformSceneData(sceneData) {
    sceneData.position.setZ(-5000)
    return sceneData
  }

  _setPos() {
    this._sceneData.position.setY(this._currY)
  }

  _stepPos() {
    this._currY += (END_POS_Y - this._currY) / 30
  }

  _setScene(mesh) {
    this._sceneData = this._transformSceneData(mesh)

    const container = document.querySelector("#background");
    const canvas = document.querySelector("#backgroundCanvas");

    this._renderer = new THREE.WebGLRenderer({canvas, antialias: false, alpha: false});
    this._renderer.setClearColor(CLEAR_COLOR_RGB);
    this._renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)

    //CAMERA
    this._camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 )
    this._camera.position.y = 5000

    //SCENE
    this._scene = new THREE.Scene();

    //LIGHTS
    const light = new THREE.AmbientLight(0xFFFFFF, 0.5);
    this._scene.add(light);

    const light1 = new THREE.PointLight(0xFFFFFF, 0.5);
    this._scene.add(light1);

    this._setPos()

    this._scene.add(mesh);

    requestAnimationFrame(this._renderThree.bind(this));
  }

  _renderThree() {
    this._setPos()
    this._stepPos()
    this._sceneData.rotation.y += 0.005;
    this._renderer.render(this._scene, this._camera);
    requestAnimationFrame(this._renderThree.bind(this));
  }

  _init() {
    this._setScene(this._createMesh())
  }

  render() {
    return (
      <section id="background">
        <canvas id="backgroundCanvas"></canvas>
      </section>
    )
  }

}

export default Background
