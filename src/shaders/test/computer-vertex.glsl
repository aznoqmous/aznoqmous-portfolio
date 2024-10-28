#include "./simplex.glsl"

varying vec2 vUv;
varying vec4 vGlPosition;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vTexColor;
varying mat4 vModelMatrix;
uniform float uTime;
uniform float uAberration;
uniform int uHarmonies;
uniform float uRatio;
uniform sampler2D uCurrentTexture;
uniform sampler2D uNextTexture;
uniform vec2 uMousePosition;

void main()
{    
    vec3 newPosition = position;
    // float dist = distance(position.xy, vec2(0.0,0.0));
    // float invertDist = 1.0 - dist;

    // newPosition.z +=  dist * dist / 2.0 * uAberration;    
    
    newPosition *= max(1.0, (sin(min(1.0, uRatio * 2.0) * PI)) * 0.2 + 1.0); // bounce



    float amplitude = sin(uRatio);
    float strength = harmony(newPosition.xy, 3, 1.0, uTime / 2.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    float dist = distance(gl_Position.xy, vec2(0.0,0.0));
    float invertDist = 1.0 - dist;
    newPosition.z +=  dist / 2.0 * uAberration; 

    newPosition += normalize(newPosition) * 0.5 * step(0.99, (sin(-uTime + gl_Position.x + gl_Position.y) + 1.0)/2.0) * uAberration;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    vNormal = normal;
    vUv = uv;
    vPosition = newPosition;
    vGlPosition = gl_Position;
    vModelMatrix = modelMatrix;
}