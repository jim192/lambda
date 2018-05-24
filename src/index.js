import {strReverse} from '@util';
import './index.less';
import myimg from './assets/abb.png';

const $app = document.getElementById('test');  
  
// function strReverse(str) {  
//   return str.split('').reverse().join('');  
// }  
  
const strInput = 'Hello World';  
const srtHolder = 'The result will be here...';  
// const strHtml = `  
// <img src="./src/assets/abb.png" alt="logo" />    
// <h1>${strInput}</h1>    
// <button id="do">Show the reverse of "${strInput}"</button>  
// <button id="reset">Do reset</button>  
// <p id="result">${srtHolder}</p>  
// `;  
const strHtml = `
<img src="${myimg}" alt="myimg"/>
<h1>${strInput}</h1>
<button id="do">Show the reverse of "${strInput}"</button>  
<button id="reset">Do reset</button>  
<p id="result">${srtHolder}</p>  
`;
  
$app.innerHTML = strHtml;  
  
const $result = document.getElementById('result');  
  
document.getElementById('do').onclick = function () {  
  $result.innerHTML = `The reverse of "${strInput}" is "${strReverse(strInput)}"`;  
};  
document.getElementById('reset').onclick = function () {  
  $result.innerHTML = srtHolder;  
};   


// var THREE = require('three');
import * as THREE from 'three';

function randomRange(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }
function shiftPosition(pos,radius){
	if(Math.abs(pos) < radius){
		if(pos>=0){
			return pos+radius;
		}else{
			return pos-radius;
		}
	}else{
		return pos;
	}
}
// Default parameters
var parameters = {
    minRadius : 30,
    maxRadius : 50,
    minSpeed:.015,
    maxSpeed:.025,
    particles:500,
    minSize:.1,
    maxSize:2
};
var camera,scene,renderer,light;
//to keep track of the mouse position
// var mouseX = 0,mouseY = 0;
//an array to store our particles in
var stars = [];
var WIDTH = window.innerWidth,HEIGHT = window.innerHeight;

function init(argument) {
	//Camera params
	//field of view, aspect ratio for render output, near and far clipping plane
	camera = new THREE.PerspectiveCamera(80,WIDTH/HEIGHT,.1,2000);
	//move the camera backwards so we can see stuff
	//default position is 0,0,0
	camera.position.z = 100;
	scene = new THREE.Scene();
	
	//The Renderer
	//
	const canvas = document.getElementById('mycanvas');
	const gl = canvas.getContext("webgl");
	console.log('mycanvas: ',canvas);
	console.log('gl: ',gl);
	// renderer = new THREE.CanvasRenderer();
	renderer = new THREE.WebGLRenderer({
		alpha:true,
		antialias:true,
		canvas:canvas,
	});
	renderer.setSize(window.innerWidth,window.innerHeight);
	var container = document.getElementById('app');
	console.log('domElement: ',renderer.domElement);
	container.appendChild(renderer.domElement);


	//Lights
	var ambientLight = new THREE.AmbientLight(0x663344,2);
    scene.add(ambientLight);

    light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(200,100,200);
    light.castShadow = true;
    light.shadow.camera.left = -400;
    light.shadow.camera.right = 400;
    light.shadow.camera.top = 400;
    light.shadow.camera.bottom = -400;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 1000;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;

    scene.add(light);

    //Screen resize
    window.addEventListener('resize',handleWindowResize,false);
    addStarts();
    loop();
}
function animateStars(z){
	//loop through each star
	for(var i=0;i<stars.length;i++){
		var star = stars[i];
		//if the particle is too close move it to the back
		if (star.position.z>z) {
			star.position.z-=2000;
		}
	}
}
function addStarts(){
	for ( var z= -2000; z < 0; z+=20 ) {

        var geometry   = new THREE.SphereGeometry(0.5, 32, 32)
        var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
        var sphere = new THREE.Mesh(geometry, material)

        sphere.position.x = randomRange(-1 * Math.floor(WIDTH/2),Math.floor(WIDTH/2));
        sphere.position.y = randomRange(-1 * Math.floor(HEIGHT/2),Math.floor(HEIGHT/2));

        // Then set the z position to where it is in the loop (distance of camera)
        sphere.position.z = z;

        // scale it up a bit
        sphere.scale.x = sphere.scale.y = 2;

        //add the sphere to the scene
        scene.add( sphere );

        //finally push it to the stars array
        stars.push(sphere);
    }
}

function loop(){
	var horizon = - 2000 + camera.position.z;
    // Adding stars
    animateStars(camera.position.z);

    camera.position.z -= 3;

    //
    // RENDER !
    //
    renderer.render(scene, camera);

    //
    // REQUEST A NEW FRAME
    //
    requestAnimationFrame(loop);
}
function handleWindowResize() {
    // Recalculate Width and Height as they had changed
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    // Update the renderer and the camera
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}
init();


/*
function update(){
	updateParticles();
	renderer.render(scene,camera);
}
function getRandomColor(){
	var r = 255*Math.random()|0, g = 255*Math.random()|0, b = 255*Math.random()|0;
	return '0x'+parseInt(r,16)+parseInt(g,16)+parseInt(b,16);
}
function makeParticles(){
	var particle,material;
	for (var zpos = -1000; zpos < 1000; zpos+=20) {
		material = new THREE.ParticleCanvasMaterial({
		// material = new THREE.ParticleBasicMaterial({
			color:0xff00ff,
			opacity:0.5,
			program:particleRender
		});
		particle = new THREE.Particle(material)

		particle.position.x = Math.random()*1000-500;
		particle.position.y = Math.random()*1000-500;
		particle.position.z = zpos;
		particle.scale.x = particle.scale.y = 10;
		scene.add(particle);
		particles.push(particle);
	}
}
function particleRender(context){
	context.beginPath();
	context.arc(0,0,1,0,Math.PI*2,true);
	context.fill();
}
function updateParticles(){
	// var particle;
	for (var i = 0; i < particles.length; i++) {
		particle = particles[i];
		particle.position.z += mouseY*0.1;
		if(particle.position.z>1000){
			particle.position.z-=2000;
		}
	}
}
function onMouseMove(event){
	mouseX = event.clientX;
	mouseY = event.clientY;
}
*/