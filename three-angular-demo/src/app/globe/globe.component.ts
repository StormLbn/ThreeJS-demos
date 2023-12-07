import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-globe',
  templateUrl: './globe.component.html',
  styleUrls: ['./globe.component.css']
})
export class GlobeComponent implements AfterViewInit {

  @ViewChild('canvas')
  private canvasRef!: ElementRef<HTMLCanvasElement>;
  
  // Shaders (= content of assets/three-shaders files but I can't load them in Angular)
  private vertexShader = `
    varying vec2 vertexUV;
    varying vec3 vertexNormal;
    void main() {
      vertexUV = uv;
      vertexNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0);
    }
  `;

  private fragmentShader = `
    uniform sampler2D globeTexture;
    varying vec2 vertexUV;
    varying vec3 vertexNormal;
    void main() {
      float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));
      vec3 atmosphere = vec3(0.3, 0.6, 1.0) * pow(intensity, 1.5);
      gl_FragColor = vec4(atmosphere + texture2D(globeTexture, vertexUV).xyz, 1.0);
    }
  `;

  private atmVertexShader = `
    varying vec3 vertexNormal;
    void main() {
      vertexNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 0.9);
    }
  `;

  private atmFragmentShader = `
    varying vec3 vertexNormal;
    void main() {
      float intensity = pow(0.7 - dot(vertexNormal, vec3(0, 0, 1.0)), 2.0);
      gl_FragColor = vec4(0.4, 0.7, 1.0, 1.0) * intensity;
    }
  `;

  constructor(private hostElement: ElementRef) {}

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
    const texture = new THREE.TextureLoader().load('assets/img/nasa_may_earth.jpg');

    // Material using shaders
    // To use texture but no shaders, use MeshBasicMaterial({map: texture})
    const material = new THREE.ShaderMaterial({
      // Passing the globe shaders
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      // Passing the texture as a custom object to import it in the shaders
      uniforms: {
        globeTexture: {
          value: texture
        }
      }
    });

    // Earth Mesh
    const sphere = new THREE.Mesh(geometry, material);
    // sphere.rotation.z = 0.2;
    
    // Adding extended atmosphere with another, bigger mesh
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(5, 50, 50),
      new THREE.ShaderMaterial({
        // Passing the atmosphere shaders
        vertexShader: this.atmVertexShader,
        fragmentShader: this.atmFragmentShader,
        // Making the rest of the object transparent
        blending: THREE.AdditiveBlending,
        // Sending object to the back
        side: THREE.BackSide
      })
    );
    atmosphere.scale.set(1.1, 1.1, 1.1);


    // Creating stars :

    // We use custom geometry, which works with points coordinates
    const starGeometry = new THREE.BufferGeometry();

    // Creating 10k random points for the grometry
    const vertices = [];
    for (let i = 0; i < 10000; i++) {
      // Creating random xand y coordinates ranging from -1000 to 1000
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      // Creating random z coordinates as negative to have stars behind the sphere only
      // Adding 0.05 so the stars aren't too close
      const z = -(Math.random() + 0.05) * 3000;
      // Adding the coordinates in the vertices "matrix"
      vertices.push(x, y, z);
    }

    // Setting the coordinates of geometry as position attribute
    starGeometry.setAttribute(
      // Attribute name
      'position',
      // Attribute value = BufferAttribute so we have to convert the "matrix" grouped by 3
      new THREE.Float32BufferAttribute(vertices, 3)
    )
    
    // We use PointsMaterial to apply color only to the geometry points (I think ?)
    const starMaterial = new THREE.PointsMaterial({color: 0xFFFFFF});

    // Creating the mesh for stars
    const stars = new THREE.Points(starGeometry, starMaterial);


    // Creating and setting the other render elements :

    const scene = new THREE.Scene();
    scene.add(sphere);
    scene.add(atmosphere);
    scene.add(stars);


    const camera = new THREE.PerspectiveCamera(
      75,
      this.hostElement.nativeElement.clientWidth / this.hostElement.nativeElement.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 11;
    
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.canvasRef.nativeElement
    });
    renderer.setSize(this.hostElement.nativeElement.clientWidth, this.hostElement.nativeElement.clientHeight, false);

    
    // Render and animation :

    function animate() {
      // Making a loop by recursion
      requestAnimationFrame(animate);
      // Rendering
      renderer.render(scene, camera);

      // rotation
      sphere.rotation.y += 0.005;
    }
    animate();
  }

}
