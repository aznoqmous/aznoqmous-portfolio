varying mat4 vModelMatrix;
varying vec3 vNormal;
varying vec2 vUv;
varying vec4 vGlPosition;
uniform float uTime;
uniform float uAberration;
uniform float uRatio;

void main()
{

    
    vec3 color = -vNormal.zzz;
    gl_FragColor = vec4(.0,.0,.0,.0);

    float alpha = min(uAberration, 0.9);
    // alpha = 0.9;

    if(abs(vNormal.z) > 0.5){

        if ( ( mod(gl_FragCoord.x, 4.001) + mod(gl_FragCoord.y, 4.0) ) > 6.00 ) {
            gl_FragColor = vec4( color * alpha, alpha);
        }
        if ( ( mod(gl_FragCoord.x + 1.0, 4.001) + mod(gl_FragCoord.y + 1.0, 4.0) ) > 6.00 ) {
            gl_FragColor = vec4( color * alpha, alpha);
        }
    }
    if(abs(vNormal.x) > 0.5){
        if ( ( mod(gl_FragCoord.x, 4.001) + mod(gl_FragCoord.y, 4.0) ) > 6.00 ) {
            gl_FragColor = vec4( color * alpha, alpha);
        }
    }
    if(vNormal.y > 0.5){
        if ( ( mod(gl_FragCoord.x, 4.001) + mod(gl_FragCoord.y, 4.0) ) > 6.00 ) {
            gl_FragColor = vec4( color * alpha, alpha);
        }
    }
    else if(-vNormal.y > 0.5){
        if ( ( mod(gl_FragCoord.x, 4.001) + mod(gl_FragCoord.y, 4.0) ) > 4.00 ) {
            gl_FragColor = vec4( color * alpha, alpha);
        }
    }

    // gl_FragColor = mix(
    //     gl_FragColor, 
    //     vec4(1.,1.,1.,1.),
    //     step(0.999, (sin(uTime + vGlPosition.x + vGlPosition.y) + 1.0)/2.0) * uAberration
    // );

    if(step(0.99, (sin(-uTime + vGlPosition.x + vGlPosition.y) + 1.0)/2.0) * uAberration >= 1.0){
        if ( mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, 8.0) == 0.0 ) {
            gl_FragColor = vec4( 1.0,1.0,1.0, alpha);
        }
    }

    // gl_FragColor = mix(
    //     gl_FragColor, 
    //     vec4(.0,.0,.0,.0), 
    //     step(0.999, (sin(-uTime + vGlPosition.x + vGlPosition.y) + 1.0)/2.0) * uAberration
    // );

    //gl_FragColor =  vec4(gl_FragColor.xyz * uAberration, min(uAberration, 0.9));
    
}