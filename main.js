import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { randFloat, randInt } from 'three/src/math/MathUtils';


// ThreeJS build pattern
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

// Spot Light
const spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set( 100, 10, 100 );
spotLight.castShadow = true;
scene.add( spotLight );

// Loader gun
const loader = new GLTFLoader();

// Gun
let base = new THREE.Object3D();
scene.add(base);
loader.load( '/public/Glock18.gltf', 
    function ( gltf ){
        gltf.scene.scale.setScalar(1)
	    base.add( gltf.scene );
    }, 
    function ( texture ){
		// in this example we create the material when the texture is loaded
		texture.colorSpace = THREE.SRGBColorSpace;
        texture.flipY = true;
    },
    undefined, function ( error ){
	    console.error( error );
});

// Group Gun 
const group = new THREE.Group();
group.add(base)
scene.add(group)
base.position.set(1,-1,0)
group.position.set(-2, -1, 15)

// Create Spheres
for(let i = -4; i < 0; i++){
    for(let j = -4; j < 6; j++){
        const geometry2 = new THREE.SphereGeometry(0.6);
        const material2 = new THREE.MeshStandardMaterial({color: 0x0000ff});
        const sphere = new THREE.Mesh(geometry2, material2);
        sphere.position.set(j*2, i*2, randFloat(0, 3));
        sphere.position.y += 8
        sphere.castShadow = false;
        sphere.receiveShadow = false;
        scene.add(sphere);
    }
}

// Plane Floor
const planeGeometry = new THREE.PlaneGeometry(25, 25, 40, 40);
const planeMaterial = new THREE.MeshStandardMaterial( {color: 0x00ff00} )
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = 4.8
plane.position.y = -5
plane.receiveShadow = true;
scene.add( plane );

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set( 0, 0, 18);

controls.update();

// Mouse Variables 
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let INTERSECTED; 

function onPointerMove(event){
	pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
	pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
}


const plane2 = new THREE.Plane(new THREE.Vector3(0, 0, 2), 2);
const mouse = new THREE.Vector2();
const pointOfIntersection = new THREE.Vector3();

function onMouseMove(event){
    mouse.x =  ((event.clientX / window.innerWidth) * 2 - 1); 
    mouse.y = (-(event.clientY / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane2, pointOfIntersection);
    group.lookAt(pointOfIntersection);
}

// Intersection with mouse pointer
function MouseIntersect(){
	raycaster.setFromCamera(pointer, camera);

	const intersects = raycaster.intersectObjects( scene.children, false );

	if (intersects.length > 0){
        if (INTERSECTED != intersects[0].object){
            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex(0xff0000);
        }
    }
	renderer.render(scene, camera);
}

function animate(){
    requestAnimationFrame(animate);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener("mousemove", onMouseMove, false);
    window.requestAnimationFrame(MouseIntersect)
    cube.rotation.y += 0.01;
    // group.rotation.y += 0.01
    // sphere.rotation.x += 0.01;
    // sphere.rotation.y += 0.01;
    controls.autoRotate = false;
    controls.update();
    renderer.render(scene, camera);
}

animate();