import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
// Importing ThreeJs classes
import * as THREE from 'three';

@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.css']
})
export class CubeComponent implements AfterViewInit {

  // Getting the reference of the canvas
  @ViewChild('canvas')  // ViewChild is set after view init
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  constructor() { }

  ngAfterViewInit(): void {

    // Creating the cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
    const cube = new THREE.Mesh(geometry, material);

    // Creating and setting the scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF);
    scene.add(cube);

    // Adding light to the scene
    const light = new THREE.DirectionalLight(0xFFFFFF, 3);
    light.position.set(-1, 2, 4);
    scene.add(light);

    // Creating and setting the camera
    const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 5);
    camera.position.z = 2;

    // Creating the renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.canvasRef.nativeElement
    });

    // Rendering
    const render = (time: number) => {
      time *= 0.001;

      cube.rotation.x = time;
      cube.rotation.y = -time;

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }
}
