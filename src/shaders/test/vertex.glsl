#include "./simplex.glsl"

varying vec2 vUv;
varying vec4 vGlPosition;
varying vec3 vPosition;
varying vec4 vTexColor;
varying vec3 vNormal;
uniform float uTime;
uniform float uAberration;
uniform int uHarmonies;
uniform float uRatio;
uniform sampler2D uCurrentTexture;
uniform sampler2D uNextTexture;
uniform vec2 uMousePosition;

void main()
{
    vTexColor = mix(texture(uCurrentTexture, uv.xy), texture(uNextTexture, uv.xy), min(uRatio, 1.0));
        
    vec3 newPosition = position;
    float dist = distance(position.xy, vec2(0.0,0.0));

    newPosition.z += vTexColor.z / 10.0;
    newPosition.z += vTexColor.z * step(0.99, (sin(-uTime + uv.x + uv.y) + 1.0)/2.0) * (0.5 + uAberration * 0.5) / 2.0;

    newPosition.z -=  dist * dist / 2.0 * uAberration;
    newPosition *= max(1.0, (sin(min(1.0, uRatio * 2.0) * PI)) * 0.2 + 1.0); // bounce


    float amplitude = sin(uRatio);
    float strength = harmony(newPosition.xy, 3, 1.0, uTime / 2.0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    vUv = uv;
    vPosition = newPosition;
    vGlPosition = gl_Position;
}