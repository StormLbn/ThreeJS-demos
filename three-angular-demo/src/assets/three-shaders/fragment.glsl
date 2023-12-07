// importing the uniform custom object to get the texture
uniform sampler2D globeTexture;

// "importing" the variables from vertex file by creating variables of the same name
varying vec2 vertexUV;
varying vec3 vertexNormal;

// Main function
void main() {
    // Color of the fragment
    // // Here we only use our picture as texture
    // gl_FragColor = texture2D(globeTexture, vertexUV);

    // To add the atmosphere effect, we need more parameters :
    // Intensity of the atmosphere
    float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));
    // Atmosphere itself = color * intensity
    vec3 atmosphere = vec3(0.3, 0.6, 1.0) * pow(intensity, 1.5);

    gl_FragColor = vec4(atmosphere + texture2D(globeTexture, vertexUV).xyz, 1.0);
}