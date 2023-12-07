varying vec3 vertexNormal;

// Main function
void main() {
    // Intensity of the atmosphere
    float intensity = pow(0.5 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 2.0);

    // Final render = color * intensity
    gl_FragColor = vec4(0.4, 0.7, 1.0, 1.0) * intensity;
}