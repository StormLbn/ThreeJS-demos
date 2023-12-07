// Creating variable of 2D coordinates and vector direction to be sent to the fragment
varying vec2 vertexUV;
varying vec3 vertexNormal;

// Main function
void main() {
    // Three.js automatically pass attributes for vertex methods
    // (Three.js documentation on WebGlProgram)

    // Using uv and normal attribute to set the variables
    vertexUV = uv;
    vertexNormal = normalize(normalMatrix * normal);

    // Using position attribute to calculate the position of the vertex
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}