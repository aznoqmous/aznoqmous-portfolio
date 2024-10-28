#include "./simplex.glsl"

uniform float uTime;
uniform float uScreenRatio;
uniform float uAmplitude;
uniform int uHarmonies;
uniform float uAttenuation;
uniform sampler2D uCurrentTexture;
uniform sampler2D uNextTexture;
uniform vec2 uMousePosition;

varying vec2 vUv;
varying vec3 vPosition;
varying vec4 vGlPosition;
varying vec4 vTexColor;
uniform float uRatio;
uniform float uAberration;

void main()
{
    vec4 color = mix(texture(uCurrentTexture, vUv.xy), texture(uNextTexture, vUv.xy), min(uRatio, 1.0));
    //color = vec4(vPosition.zzz * 10.0, 1.0);

    if(uRatio < 1.0){
        float elevation = step(uRatio, distance(vUv.xy, vec2(0.5,0.5)));
        color = mix(texture(uNextTexture, vUv.xy), texture(uCurrentTexture, vUv.xy),  min(elevation, 1.0));
    }
    
    // color = mix(
    //     color, 
    //     vec4(1.0,1.0,1.0,1.0), 
    //     step(0.99, (sin(-uTime + vUv.x + vUv.y) + 1.0)/2.0) * uAberration
    // );
    

    //gl_FragColor = vec4(vGlPosition.xy, 0.0, 1.0);
    gl_FragColor = color;
}