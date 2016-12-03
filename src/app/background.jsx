import mobx from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'

import ImprovedNoise from './improvedNoise'
import state from './state/'

import './background.less'

import * as THREE from 'three'

const INIT_DELAY_MS = 1500

const CLEAR_COLOR_RGB = 0x224466

const START_POS_Y = -5000
const END_POS_Y = 0

const MOUNTAIN_GRID_SIZE = 7500
const TERRAIN_WIDTH = 256
const TERRAIN_DEPTH = 256

const WHITE_BALL_MATERIAL = new THREE.MeshLambertMaterial({color: 0xFFFFFF})

@observer
class Background extends React.Component {

  constructor() {
    super()
    this._scene         = null  // Three.js Scene instance
    this._sceneData     = null  // Scene data from file
    this._camera        = null
    this._renderer      = null
    this._currY         = START_POS_Y
    this._ballMaterial  = WHITE_BALL_MATERIAL
    this._ballMesh      = null
    this._leaderImage   = null

    mobx.autorun(this._updateBall.bind(this))

    setTimeout(this._init.bind(this), INIT_DELAY_MS)
  }

  _updateBall() {
    const leaderImage = this._getLeaderImage() || null
    if (leaderImage !== this._leaderImage) {
      this._ballMaterial = this._createLeaderBallMaterial(leaderImage)
      this._leaderImage = leaderImage
      if (this._ballMesh) {
        this._ballMesh.material = this._ballMaterial
      }
    }
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

			var v = ~~ ( Math.random() * 20 );

			imageData[ i ] += v;
			imageData[ i + 1 ] += v;
			imageData[ i + 2 ] += v;

		}

		context.putImageData( image, 0, 0 );

		return canvasScaled;

	}

  _generateHeightData(width, height) {
		const size = width * height
    const heights = new Uint16Array(size)
		const perlin = new ImprovedNoise()
    let quality = 1
    const z = Math.random() * 100

    const center = TERRAIN_WIDTH / 2
    const maxDist = Math.sqrt(2 * Math.pow(center, 2))

		for ( let j = 0; j < 4; j ++ ) {
			for ( let i = 0; i < size; i ++ ) {
				const x = i % width
        const y = ~~ ( i / width )
				heights[ i ] += Math.abs(perlin.noise( x / quality, y / quality, z ) * quality * 1.75)
			}
			quality *= 5;
		}

    let highestHeight = null
    let highestCoords = null

    for ( let i = 0; i < size; i ++ ) {
      const x = i % width
      const y = ~~ ( i / width )
      const distFromCenter = Math.sqrt(Math.pow(center - x, 2) + Math.pow(center - y, 2))
      const distDelta = Math.max((maxDist - distFromCenter) / maxDist, 0) * 350
      heights[i] += distDelta
      if (highestHeight === null || heights[i] > highestHeight) {
        highestHeight = heights[i]
        highestCoords = { x, y, height: highestHeight }
      }
    }

		return { heights, highestCoords }
	}

  _createMountainMaterial(heights) {
    const texture = new THREE.CanvasTexture(this._generateTexture(heights, TERRAIN_WIDTH, TERRAIN_DEPTH))
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    return new THREE.MeshBasicMaterial({ map: texture })
  }

  _createGeometryFromHeights(heights) {
    const geometry = new THREE.PlaneBufferGeometry( MOUNTAIN_GRID_SIZE, MOUNTAIN_GRID_SIZE, TERRAIN_WIDTH - 1, TERRAIN_DEPTH - 1 )
    geometry.rotateX(-Math.PI/2)
    const vertices = geometry.attributes.position.array
		for ( let i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
			vertices[ j + 1 ] = heights[ i ] * 15
		}
    return geometry
  }

  _createLeaderBallMaterial(image) {
    const textureLoader = new THREE.TextureLoader()
    const textureSphere = textureLoader.load(image)
		textureSphere.mapping = THREE.SphericalReflectionMapping
    return new THREE.MeshLambertMaterial( { envMap: textureSphere } )
  }

  _getLeaderImage() {
    const leader = state.leaderboard.peek()[0]
    return leader && leader.image
  }

  _addBall(scene, highestCoords) {
    const geometry = new THREE.SphereGeometry(200, 50, 50);

    const mesh = new THREE.Mesh(geometry, this._ballMaterial);
    mesh.position.x = (highestCoords.x - (TERRAIN_WIDTH / 2)) * (MOUNTAIN_GRID_SIZE / TERRAIN_WIDTH)
    mesh.position.z = (highestCoords.y - (TERRAIN_WIDTH / 2)) * (MOUNTAIN_GRID_SIZE / TERRAIN_WIDTH)
    mesh.position.y = highestCoords.height * 15
    this._ballMesh = mesh

    scene.add(mesh)
  }

  _createMesh() {

    const heightData = this._generateHeightData(TERRAIN_WIDTH, TERRAIN_DEPTH)
    const heights = heightData.heights

    const geometry = this._createGeometryFromHeights(heights)
    const material = this._createMountainMaterial(heights)

    const mesh = new THREE.Mesh(geometry, material)

    const scene = new THREE.Scene()
    scene.add(mesh)

    this._addBall(scene, heightData.highestCoords)


    return scene
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

    this._renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: false});
    this._renderer.setClearColor(CLEAR_COLOR_RGB);
    this._renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)

    //CAMERA
    this._camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 )
    this._camera.position.y = 5500

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
