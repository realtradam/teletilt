import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

const white = 0xFFFFFF;
const skyColor = 0xB1E1FF;  // light blue
const groundColor = 0xB97A20;  // brownish orange
const ambient_light = new THREE.HemisphereLight(skyColor, groundColor, 1);
scene.add(ambient_light);


function animate() {

	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;

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
					cube.rotation.x = e.beta/15.0; //-front +back
					cube.rotation.y = e.gamma/15.0; //-left +right
					if(Math.abs(e.beta) > 1) {
						cube.position.y += -e.beta / 240
					}
					if(Math.abs(e.gamma) > 1) {
						cube.position.x += e.gamma / 240
					}

					if(cube.position.x > 4) {
						cube.position.x -= 1
						cube.position.x = -cube.position.x
					}
					else if(cube.position.x < -4) {
						cube.position.x += 1
						cube.position.x = -cube.position.x
					}

					if(cube.position.y > 6) {
						cube.position.y -= 1
						cube.position.y = -cube.position.y
					}
					else if(cube.position.y < -6) {
						cube.position.y += 1
						cube.position.y = -cube.position.y
					}


					
					document.getElementById("info").textContent=`x: ${Math.round(cube.position.x * 10)}, y: ${Math.round(cube.position.y * 10)}`;
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
