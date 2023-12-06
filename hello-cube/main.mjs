// Import used for dev (auto-completing and documentation)
import * as THREE from 'three';

// Test script is working
console.log("Hello Cube !");

// HTML canvas selection
const canvas = document.querySelector('#canvas');

// Creation of the renderer for the canvas
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas
});

// Creation of the camera with parameters :
    // fov = field of view
    // aspect : canvas default is 300*150 so default aspect is 300*150 = 2
    // near and far : space in front of the camera that will be rendered (here between 0.1 and 5 from the camera)
const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 5);

// Moving the camera to see objects placed at the origin
camera.position.z = 2;

// Creation of the scene
const scene = new THREE.Scene();

// Creation of the geometry object (= shape) with parameters width, height and depth
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Creation of the matérial (= surface properties of the 3D object) with a color
// MeshBasicMaterial is not affected by light, so we use MeshPhongMaterial
const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });

// Creation of the Mesh = 3D object itself, made from a Geometry object and a Material object
const cube = new THREE.Mesh(geometry, material);

// Adding the mesh to the scene to make it visible (~ add decor in a studio scene)
scene.add(cube);

// Rendering the scene (~ starting shooting the scene with the camera)
// renderer.render(scene, camera);

// Render loop function to make the cube rotate
function render(time) {
    // Converting time to seconds to make cube slower
    time *= 0.001;

    // Setting rotation (in radians)
    cube.rotation.x = time;
    cube.rotation.y = -time;

    // Rendering the scene
    renderer.render(scene, camera);

    // Reccursive call of the function by requesting animation frame
    requestAnimationFrame(render);
}

// Request of an animation frame, with function as parameter
// The function is called here by the browser, with time since the page loaded as parameter (in ms)
requestAnimationFrame(render);

// Adding a light to the scene, with parameters color (as THREE.ColorRepresentation) and intensity
const light = new THREE.DirectionalLight(0xFFFFFF, 3);
light.position.set(-1, 2, 4);
scene.add(light);

// We can make a function to create Mesh objects
function makeInstance(geometry, color, x) {
    // Setting the material (color) of the mesh
    const material = new THREE.MeshPhongMaterial({color});

    // Creating the mesh and adding it to scene at specified position
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    mesh.position.x = x;
    mesh.rotation.x = 10;

    return mesh;
}

// Creation of more cubes
const cubes = [
    makeInstance(geometry, 0x8844aa, -2),
    makeInstance(geometry, 0xaa8844, 2)
];

