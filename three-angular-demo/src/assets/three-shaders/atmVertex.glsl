varying vec3 vertexNormal;

// Main function
void main() {
    vertexNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}