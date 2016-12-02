import React from 'react'

import './background.less'

import * as THREE from 'three'

const MATERIAL_RGB = 0x336699
const CLEAR_COLOR_RGB = 0x224466

class Background extends React.Component {

  constructor() {
    super()
    this._scene = null      // Three.js Scene instance
    this._sceneData = null  // Scene data from file
    this._camera = null
    this._renderer = null
    this._init()
  }

  _transformSceneData(sceneData) {
    sceneData.children.forEach((child) => {
      child.material = new THREE.MeshLambertMaterial({color: MATERIAL_RGB});
      child.translateY(4.0) // move top of mountain so it stays centered when rotated
    })
    return sceneData
  }

  _setScene(sceneData) {
    this._sceneData = this._transformSceneData(sceneData)

    const container = document.querySelector("#background");
    const canvas = document.querySelector("#backgroundCanvas");

    this._renderer = new THREE.WebGLRenderer({canvas, antialias: false, alpha: false});
    this._renderer.setClearColor(CLEAR_COLOR_RGB);
    this._renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)

    //CAMERA
    this._camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 3000);

    //SCENE
    this._scene = new THREE.Scene();

    //LIGHTS
    const light = new THREE.AmbientLight(0xffffff, 0.5);
    this._scene.add(light);

    const light1 = new THREE.PointLight(0xffffff, 0.5);
    this._scene.add(light1);

    sceneData.position.set(0, -5, -9);

    this._scene.add(sceneData);

    requestAnimationFrame(this._renderThree.bind(this));
  }

  _renderThree() {
    this._sceneData.rotation.y += 0.005;
    this._renderer.render(this._scene, this._camera);
    requestAnimationFrame(this._renderThree.bind(this));
  }

  _init() {
    const loader = new THREE.ObjectLoader()
    loader.load('./app/mountain.json', this._setScene.bind(this))
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
