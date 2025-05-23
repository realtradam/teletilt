import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshLambertMaterial( { color: 0x9370db } );
var mainChar = new THREE.Mesh( geometry, material );
//scene.add( mainChar );

import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';

const objLoader = new OBJLoader();
objLoader.load('map.obj', (root) => {
	mainChar = root;
	root.scale.set(0.25,0.25,0.25);
 root.traverse((child) => {
        if (child.isMesh) {
            child.material = material; // Assign the MeshLambertMaterial
        }
    });
	scene.add(root);
});

camera.position.z = 5;

const white = 0xFFFFFF;
const skyColor = 0xB1E1FF;  // light blue
const groundColor = 0xB97A20;  // brownish orange
const ambient_light = new THREE.HemisphereLight(skyColor, groundColor, 1);
scene.add(ambient_light);


function animate() {

	//mainChar.rotation.x += 0.01;
	//mainChar.rotation.y += 0.01;

	renderer.render( scene, camera);
}
renderer.setAnimationLoop(animate);

const motionEvent = (response) => {
            // (optional) Do something after API prompt dismissed.
            if ( response == "granted" ) {
				window.addEventListener("deviceorientation", (e) => {
					//elem.style.transform = `rotateZ(${-e.alpha}deg) rotateX(${-e.beta}deg) rotateY(${
					//  e.gamma
					//}deg)`;
					mainChar.rotation.x = e.beta/15.0; //-front +back
					mainChar.rotation.y = e.gamma/15.0; //-left +right
					if(Math.abs(e.beta) > 1) {
						mainChar.position.y += -e.beta / 240
					}
					if(Math.abs(e.gamma) > 1) {
						mainChar.position.x += e.gamma / 240
					}

					if(mainChar.position.x > 4) {
						mainChar.position.x -= 1
						mainChar.position.x = -mainChar.position.x
					}
					else if(mainChar.position.x < -4) {
						mainChar.position.x += 1
						mainChar.position.x = -mainChar.position.x
					}

					if(mainChar.position.y > 6) {
						mainChar.position.y -= 1
						mainChar.position.y = -mainChar.position.y
					}
					else if(mainChar.position.y < -6) {
						mainChar.position.y += 1
						mainChar.position.y = -mainChar.position.y
					}


					
					document.getElementById("info").textContent=`x: ${Math.round(mainChar.position.x * 10)}, y: ${Math.round(mainChar.position.y * 10)}`;
				});
            }
}

if ( location.protocol != "https:" ) {
location.href = "https:" + window.location.href.substring( window.location.protocol.length );
}
function permission () {
    if ( typeof( DeviceMotionEvent ) !== "undefined") {
        // (optional) Do something before API request prompt.
		if(typeof( DeviceMotionEvent.requestPermission ) === "function") {
        DeviceMotionEvent.requestPermission()
            .then(motionEvent)
            .catch( console.error )
		}
		else {
			motionEvent("granted");
		}
    } else {
        alert( "DeviceMotionEvent is not defined" );
    }
}
const btn = document.getElementById( "request" );
btn.addEventListener( "click", permission );
