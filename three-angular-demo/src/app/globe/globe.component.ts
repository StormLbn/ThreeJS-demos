import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
// Importing the shader files
// import vertexShader from 'assets/three-shaders/vertex.glsl';

@Component({
  selector: 'app-globe',
  templateUrl: './globe.component.html',
  styleUrls: ['./globe.component.css']
})
export class GlobeComponent implements AfterViewInit {

  @ViewChild('canvas')
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    // Creating the globe :

    // Shape
    const geometry = new THREE.SphereGeometry(
      // radius
      5,
      // width and height segment => make the surface smoother
      50,
      50
    );

    // Image texture for the globe
    const texture = new THREE.TextureLoader().load('assets/img/01-3.jpg')

    // Material using shaders
    const material = new THREE.ShaderMaterial({
      // vertexShader: 
    })

    // Mesh
    const sphere = new THREE.Mesh(geometry, material);

    // Creating and setting the other render elements :

    const scene = new THREE.Scene();
    scene.add(sphere);

    // const light = new THREE.DirectionalLight(0xFFFFFF, 3);
    // light.position.set(-1, 2, 4);
    // scene.add(light);

    const camera = new THREE.PerspectiveCamera(
      75,
      innerWidth/innerHeight,
      0.1,
      1000
      );
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.canvasRef.nativeElement
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(innerWidth, innerHeight);


    // Render and animation :

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();
  }
}
