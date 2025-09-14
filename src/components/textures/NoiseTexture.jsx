import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const TextureMesh = () => {
  const mesh = useRef(null);
  
  useFrame((state) => {
    const { clock, mouse, gl, scene, camera } = state;
    if (mesh.current) {
      mesh.current.material.uniforms.u_mouse.value = [mouse.x / 2 + 0.5, mouse.y / 2 + 0.5];
      mesh.current.material.uniforms.u_time.value = clock.getElapsedTime();
      let c = gl.domElement.getBoundingClientRect();
      mesh.current.material.uniforms.u_resolution.value = [c.width, c.height];
    }
  });

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        u_intensity: { value: 0.404 },
        u_colors: { 
          value: [
            new THREE.Vector4(1, 0.545, 0.545, 1), // Pastel Red
            new THREE.Vector4(1, 1, 1, 1) // White
          ]
        },
        u_speed: { value: 0.400 },
        u_scale: { value: 0.334 },
        u_time: { value: 0 },
        u_mouse: { value: [0, 0] },
        u_resolution: { value: [1024, 1024] }
      },
      fragmentShader: `
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;
        uniform float u_time;
        uniform float u_intensity;
        uniform vec4 u_colors[2];
        uniform float u_speed;
        uniform float u_scale;

        varying vec2 vUv;
        varying float vDisplacement;

        #ifndef FNC_MOD289
        #define FNC_MOD289
        float mod289(const in float x) { return x - floor(x * (1. / 289.)) * 289.; }
        vec2 mod289(const in vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }
        vec3 mod289(const in vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
        vec4 mod289(const in vec4 x) { return x - floor(x * (1. / 289.)) * 289.; }
        #endif

        #ifndef FNC_PERMUTE
        #define FNC_PERMUTE
        float permute(const in float x) { return mod289(((x * 34.0) + 1.0) * x); }
        vec2 permute(const in vec2 x) { return mod289(((x * 34.0) + 1.0) * x); }
        vec3 permute(const in vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
        vec4 permute(const in vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
        #endif

        #ifndef FNC_TAYLORINVSQRT
        #define FNC_TAYLORINVSQRT
        float taylorInvSqrt(in float r) { return 1.79284291400159 - 0.85373472095314 * r; }
        vec2 taylorInvSqrt(in vec2 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        vec3 taylorInvSqrt(in vec3 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        vec4 taylorInvSqrt(in vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        #endif

        #ifndef FNC_QUINTIC
        #define FNC_QUINTIC 
        float quintic(const in float v) { return v*v*v*(v*(v*6.0-15.0)+10.0); }
        vec2  quintic(const in vec2 v)  { return v*v*v*(v*(v*6.0-15.0)+10.0); }
        vec3  quintic(const in vec3 v)  { return v*v*v*(v*(v*6.0-15.0)+10.0); }
        vec4  quintic(const in vec4 v)  { return v*v*v*(v*(v*6.0-15.0)+10.0); }
        #endif

        #ifndef FNC_PNOISE
        #define FNC_PNOISE
        float pnoise(in vec2 P, in vec2 rep) {
            vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
            vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
            Pi = mod(Pi, rep.xyxy); 
            Pi = mod289(Pi);        
            vec4 ix = Pi.xzxz;
            vec4 iy = Pi.yyww;
            vec4 fx = Pf.xzxz;
            vec4 fy = Pf.yyww;

            vec4 i = permute(permute(ix) + iy);

            vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
            vec4 gy = abs(gx) - 0.5 ;
            vec4 tx = floor(gx + 0.5);
            gx = gx - tx;

            vec2 g00 = vec2(gx.x,gy.x);
            vec2 g10 = vec2(gx.y,gy.y);
            vec2 g01 = vec2(gx.z,gy.z);
            vec2 g11 = vec2(gx.w,gy.w);

            vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
            g00 *= norm.x;
            g01 *= norm.y;
            g10 *= norm.z;
            g11 *= norm.w;

            float n00 = dot(g00, vec2(fx.x, fy.x));
            float n10 = dot(g10, vec2(fx.y, fy.y));
            float n01 = dot(g01, vec2(fx.z, fy.z));
            float n11 = dot(g11, vec2(fx.w, fy.w));

            vec2 fade_xy = quintic(Pf.xy);
            vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
            float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
            return 2.3 * n_xy;
        }
        #endif

        #ifndef RANDOM_SCALE
        #if defined(RANDOM_HIGHER_RANGE)
        #define RANDOM_SCALE vec4(.1031, .1030, .0973, .1099)
        #else
        #define RANDOM_SCALE vec4(443.897, 441.423, .0973, .1099)
        #endif
        #endif

        #ifndef FNC_RANDOM
        #define FNC_RANDOM
        float random(in float x) {
        #if defined(RANDOM_SINLESS)
            x = fract(x * RANDOM_SCALE.x);
            x *= x + 33.33;
            x *= x + x;
            return fract(x);
        #else
            return fract(sin(x) * 43758.5453);
        #endif
        }

        float random(in vec2 st) {
        #if defined(RANDOM_SINLESS)
            vec3 p3  = fract(vec3(st.xyx) * RANDOM_SCALE.xyz);
            p3 += dot(p3, p3.yzx + 33.33);
            return fract((p3.x + p3.y) * p3.z);
        #else
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
        #endif
        }

        float random(in vec3 pos) {
        #if defined(RANDOM_SINLESS)
            pos  = fract(pos * RANDOM_SCALE.xyz);
            pos += dot(pos, pos.zyx + 31.32);
            return fract((pos.x + pos.y) * pos.z);
        #else
            return fract(sin(dot(pos.xyz, vec3(70.9898, 78.233, 32.4355))) * 43758.5453123);
        #endif
        }

        float random(in vec4 pos) {
        #if defined(RANDOM_SINLESS)
            pos = fract(pos * RANDOM_SCALE);
            pos += dot(pos, pos.wzxy+33.33);
            return fract((pos.x + pos.y) * (pos.z + pos.w));
        #else
            float dot_product = dot(pos, vec4(12.9898,78.233,45.164,94.673));
            return fract(sin(dot_product) * 43758.5453);
        #endif
        }
        #endif

        void main() {
          float distort = vDisplacement * u_intensity;
          vec2 val = abs(vUv - 0.5) * 3.0  * (1.0 - distort);
          vec4 color = vec4(vec3(val,u_colors[0].b),1.0);
          color = mix(u_colors[0], u_colors[1], vDisplacement);
          gl_FragColor = color;
        }
      `,
      vertexShader: `
        uniform float u_intensity;
        uniform float u_time;
        uniform float u_speed;
        uniform bool u_rotate;
        uniform float u_scale;

        varying vec2 vUv;
        varying float vDisplacement;

        #ifndef FNC_MOD289
        #define FNC_MOD289
        float mod289(const in float x) { return x - floor(x * (1. / 289.)) * 289.; }
        vec2 mod289(const in vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }
        vec3 mod289(const in vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
        vec4 mod289(const in vec4 x) { return x - floor(x * (1. / 289.)) * 289.; }
        #endif

        #ifndef FNC_PERMUTE
        #define FNC_PERMUTE
        float permute(const in float x) { return mod289(((x * 34.0) + 1.0) * x); }
        vec2 permute(const in vec2 x) { return mod289(((x * 34.0) + 1.0) * x); }
        vec3 permute(const in vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
        vec4 permute(const in vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
        #endif

        #ifndef FNC_TAYLORINVSQRT
        #define FNC_TAYLORINVSQRT
        float taylorInvSqrt(in float r) { return 1.79284291400159 - 0.85373472095314 * r; }
        vec2 taylorInvSqrt(in vec2 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        vec3 taylorInvSqrt(in vec3 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        vec4 taylorInvSqrt(in vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        #endif

        #ifndef FNC_QUINTIC
        #define FNC_QUINTIC 
        float quintic(const in float v) { return v*v*v*(v*(v*6.0-15.0)+10.0); }
        vec2  quintic(const in vec2 v)  { return v*v*v*(v*(v*6.0-15.0)+10.0); }
        vec3  quintic(const in vec3 v)  { return v*v*v*(v*(v*6.0-15.0)+10.0); }
        vec4  quintic(const in vec4 v)  { return v*v*v*(v*(v*6.0-15.0)+10.0); }
        #endif

        #ifndef FNC_CNOISE
        #define FNC_CNOISE
        float cnoise(in vec2 P) {
            vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
            vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
            Pi = mod289(Pi); 
            vec4 ix = Pi.xzxz;
            vec4 iy = Pi.yyww;
            vec4 fx = Pf.xzxz;
            vec4 fy = Pf.yyww;

            vec4 i = permute(permute(ix) + iy);

            vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
            vec4 gy = abs(gx) - 0.5 ;
            vec4 tx = floor(gx + 0.5);
            gx = gx - tx;

            vec2 g00 = vec2(gx.x,gy.x);
            vec2 g10 = vec2(gx.y,gy.y);
            vec2 g01 = vec2(gx.z,gy.z);
            vec2 g11 = vec2(gx.w,gy.w);

            vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
            g00 *= norm.x;
            g01 *= norm.y;
            g10 *= norm.z;
            g11 *= norm.w;

            float n00 = dot(g00, vec2(fx.x, fy.x));
            float n10 = dot(g10, vec2(fx.y, fy.y));
            float n01 = dot(g01, vec2(fx.z, fy.z));
            float n11 = dot(g11, vec2(fx.w, fy.w));

            vec2 fade_xy = quintic(Pf.xy);
            vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
            float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
            return 2.3 * n_xy;
        }

        float cnoise(in vec3 P) {
            vec3 Pi0 = floor(P); 
            vec3 Pi1 = Pi0 + vec3(1.0); 
            Pi0 = mod289(Pi0);
            Pi1 = mod289(Pi1);
            vec3 Pf0 = fract(P); 
            vec3 Pf1 = Pf0 - vec3(1.0); 
            vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
            vec4 iy = vec4(Pi0.yy, Pi1.yy);
            vec4 iz0 = Pi0.zzzz;
            vec4 iz1 = Pi1.zzzz;

            vec4 ixy = permute(permute(ix) + iy);
            vec4 ixy0 = permute(ixy + iz0);
            vec4 ixy1 = permute(ixy + iz1);

            vec4 gx0 = ixy0 * (1.0 / 7.0);
            vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
            gx0 = fract(gx0);
            vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
            vec4 sz0 = step(gz0, vec4(0.0));
            gx0 -= sz0 * (step(0.0, gx0) - 0.5);
            gy0 -= sz0 * (step(0.0, gy0) - 0.5);

            vec4 gx1 = ixy1 * (1.0 / 7.0);
            vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
            gx1 = fract(gx1);
            vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
            vec4 sz1 = step(gz1, vec4(0.0));
            gx1 -= sz1 * (step(0.0, gx1) - 0.5);
            gy1 -= sz1 * (step(0.0, gy1) - 0.5);

            vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
            vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
            vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
            vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
            vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
            vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
            vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
            vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

            vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
            g000 *= norm0.x;
            g010 *= norm0.y;
            g100 *= norm0.z;
            g110 *= norm0.w;
            vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
            g001 *= norm1.x;
            g011 *= norm1.y;
            g101 *= norm1.z;
            g111 *= norm1.w;

            float n000 = dot(g000, Pf0);
            float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
            float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
            float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
            float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
            float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
            float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
            float n111 = dot(g111, Pf1);

            vec3 fade_xyz = quintic(Pf0);
            vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
            vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
            float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
            return 2.2 * n_xyz;
        }
        #endif

        #ifndef RANDOM_SCALE
        #if defined(RANDOM_HIGHER_RANGE)
        #define RANDOM_SCALE vec4(.1031, .1030, .0973, .1099)
        #else
        #define RANDOM_SCALE vec4(443.897, 441.423, .0973, .1099)
        #endif
        #endif

        #ifndef FNC_RANDOM
        #define FNC_RANDOM
        float random(in float x) {
        #if defined(RANDOM_SINLESS)
            x = fract(x * RANDOM_SCALE.x);
            x *= x + 33.33;
            x *= x + x;
            return fract(x);
        #else
            return fract(sin(x) * 43758.5453);
        #endif
        }

        float random(in vec2 st) {
        #if defined(RANDOM_SINLESS)
            vec3 p3  = fract(vec3(st.xyx) * RANDOM_SCALE.xyz);
            p3 += dot(p3, p3.yzx + 33.33);
            return fract((p3.x + p3.y) * p3.z);
        #else
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
        #endif
        }

        float random(in vec3 pos) {
        #if defined(RANDOM_SINLESS)
            pos  = fract(pos * RANDOM_SCALE.xyz);
            pos += dot(pos, pos.zyx + 31.32);
            return fract((pos.x + pos.y) * pos.z);
        #else
            return fract(sin(dot(pos.xyz, vec3(70.9898, 78.233, 32.4355))) * 43758.5453123);
        #endif
        }

        float random(in vec4 pos) {
        #if defined(RANDOM_SINLESS)
            pos = fract(pos * RANDOM_SCALE);
            pos += dot(pos, pos.wzxy+33.33);
            return fract((pos.x + pos.y) * (pos.z + pos.w));
        #else
            float dot_product = dot(pos, vec4(12.9898,78.233,45.164,94.673));
            return fract(sin(dot_product) * 43758.5453);
        #endif
        }
        #endif

        #ifndef FNC_SRANDOM
        #define FNC_SRANDOM
        float srandom(in float x) {
          return -1. + 2. * fract(sin(x) * 43758.5453);
        }

        float srandom(in vec2 st) {
          return -1. + 2. * fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
        }

        float srandom(in vec3 pos) {
          return -1. + 2. * fract(sin(dot(pos.xyz, vec3(70.9898, 78.233, 32.4355))) * 43758.5453123);
        }

        float srandom(in vec4 pos) {
            float dot_product = dot(pos, vec4(12.9898,78.233,45.164,94.673));
            return -1. + 2. * fract(sin(dot_product) * 43758.5453);
        }

        vec2 srandom2(in vec2 st) {
            const vec2 k = vec2(.3183099, .3678794);
            st = st * k + k.yx;
            return -1. + 2. * fract(16. * k * fract(st.x * st.y * (st.x + st.y)));
        }

        vec3 srandom3(in vec3 p) {
            p = vec3( dot(p, vec3(127.1, 311.7, 74.7)),
                    dot(p, vec3(269.5, 183.3, 246.1)),
                    dot(p, vec3(113.5, 271.9, 124.6)));
            return -1. + 2. * fract(sin(p) * 43758.5453123);
        }

        vec2 srandom2(in vec2 p, const in float tileLength) {
            p = mod(p, vec2(tileLength));
            return srandom2(p);
        }

        vec3 srandom3(in vec3 p, const in float tileLength) {
            p = mod(p, vec3(tileLength));
            return srandom3(p);
        }
        #endif

        #ifndef FNC_CUBIC
        #define FNC_CUBIC 
        float cubic(const in float v) { return v*v*(3.0-2.0*v); }
        vec2  cubic(const in vec2 v)  { return v*v*(3.0-2.0*v); }
        vec3  cubic(const in vec3 v)  { return v*v*(3.0-2.0*v); }
        vec4  cubic(const in vec4 v)  { return v*v*(3.0-2.0*v); }
        #endif

        #ifndef FNC_GNOISE
        #define FNC_GNOISE
        float gnoise(float x) {
            float i = floor(x);  
            float f = fract(x);  
            return mix(random(i), random(i + 1.0), smoothstep(0.,1.,f)); 
        }

        float gnoise(vec2 st) {
            vec2 i = floor(st);
            vec2 f = fract(st);
            float a = random(i);
            float b = random(i + vec2(1.0, 0.0));
            float c = random(i + vec2(0.0, 1.0));
            float d = random(i + vec2(1.0, 1.0));
            vec2 u = cubic(f);
            return mix( a, b, u.x) +
                        (c - a)* u.y * (1.0 - u.x) +
                        (d - b) * u.x * u.y;
        }

        float gnoise(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);
            vec3 u = quintic(f);
            return -1.0 + 2.0 * mix( mix( mix( random(i + vec3(0.0,0.0,0.0)), 
                                                random(i + vec3(1.0,0.0,0.0)), u.x),
                                        mix( random(i + vec3(0.0,1.0,0.0)), 
                                                random(i + vec3(1.0,1.0,0.0)), u.x), u.y),
                                    mix( mix( random(i + vec3(0.0,0.0,1.0)), 
                                                random(i + vec3(1.0,0.0,1.0)), u.x),
                                        mix( random(i + vec3(0.0,1.0,1.0)), 
                                                random(i + vec3(1.0,1.0,1.0)), u.x), u.y), u.z );
        }

        float gnoise(vec3 p, float tileLength) {
            vec3 i = floor(p);
            vec3 f = fract(p);
                    
            vec3 u = quintic(f);
                    
            return mix( mix( mix( dot( srandom3(i + vec3(0.0,0.0,0.0), tileLength), f - vec3(0.0,0.0,0.0)), 
                                    dot( srandom3(i + vec3(1.0,0.0,0.0), tileLength), f - vec3(1.0,0.0,0.0)), u.x),
                            mix( dot( srandom3(i + vec3(0.0,1.0,0.0), tileLength), f - vec3(0.0,1.0,0.0)), 
                                    dot( srandom3(i + vec3(1.0,1.0,0.0), tileLength), f - vec3(1.0,1.0,0.0)), u.x), u.y),
                        mix( mix( dot( srandom3(i + vec3(0.0,0.0,1.0), tileLength), f - vec3(0.0,0.0,1.0)), 
                                    dot( srandom3(i + vec3(1.0,0.0,1.0), tileLength), f - vec3(1.0,0.0,1.0)), u.x),
                            mix( dot( srandom3(i + vec3(0.0,1.0,1.0), tileLength), f - vec3(0.0,1.0,1.0)), 
                                    dot( srandom3(i + vec3(1.0,1.0,1.0), tileLength), f - vec3(1.0,1.0,1.0)), u.x), u.y), u.z );
        }

        vec3 gnoise3(vec3 x) {
            return vec3(gnoise(x+vec3(123.456, 0.567, 0.37)),
                        gnoise(x+vec3(0.11, 47.43, 19.17)),
                        gnoise(x) );
        }
        #endif

        #ifndef FNC_SNOISE
        #define FNC_SNOISE
        float snoise(vec2 v) {
            return gnoise(v);
        }
        float snoise(vec3 v) {
            return gnoise(v);
        }
        #endif

        #ifndef FBM_OCTAVES
        #define FBM_OCTAVES 4
        #endif

        #ifndef FBM_NOISE_FNC
        #define FBM_NOISE_FNC(UV) snoise(UV)
        #endif

        #ifndef FBM_NOISE2_FNC
        #define FBM_NOISE2_FNC(UV) FBM_NOISE_FNC(UV)
        #endif

        #ifndef FBM_NOISE3_FNC
        #define FBM_NOISE3_FNC(UV) FBM_NOISE_FNC(UV)
        #endif

        #ifndef FBM_NOISE_TILABLE_FNC
        #define FBM_NOISE_TILABLE_FNC(UV, TILE) gnoise(UV, TILE)
        #endif

        #ifndef FBM_NOISE3_TILABLE_FNC
        #define FBM_NOISE3_TILABLE_FNC(UV, TILE) FBM_NOISE_TILABLE_FNC(UV, TILE)
        #endif

        #ifndef FBM_NOISE_TYPE
        #define FBM_NOISE_TYPE float
        #endif

        #ifndef FBM_VALUE_INITIAL
        #define FBM_VALUE_INITIAL 0.0
        #endif

        #ifndef FBM_SCALE_SCALAR
        #define FBM_SCALE_SCALAR 2.0
        #endif

        #ifndef FBM_AMPLITUD_INITIAL
        #define FBM_AMPLITUD_INITIAL 0.5
        #endif

        #ifndef FBM_AMPLITUD_SCALAR
        #define FBM_AMPLITUD_SCALAR 0.5
        #endif

        #ifndef FNC_FBM
        #define FNC_FBM
        FBM_NOISE_TYPE fbm(in vec2 st) {
            FBM_NOISE_TYPE value = FBM_NOISE_TYPE(FBM_VALUE_INITIAL);
            float amplitud = FBM_AMPLITUD_INITIAL;

            for (int i = 0; i < FBM_OCTAVES; i++) {
                value += amplitud * FBM_NOISE2_FNC(st);
                st *= FBM_SCALE_SCALAR;
                amplitud *= FBM_AMPLITUD_SCALAR;
            }
            return value;
        }

        FBM_NOISE_TYPE fbm(in vec3 pos) {
            FBM_NOISE_TYPE value = FBM_NOISE_TYPE(FBM_VALUE_INITIAL);
            float amplitud = FBM_AMPLITUD_INITIAL;

            for (int i = 0; i < FBM_OCTAVES; i++) {
                value += amplitud * FBM_NOISE3_FNC(pos);
                pos *= FBM_SCALE_SCALAR;
                amplitud *= FBM_AMPLITUD_SCALAR;
            }
            return value;
        }

        FBM_NOISE_TYPE fbm(vec3 p, float tileLength) {
            const float persistence = 0.5;
            const float lacunarity = 2.0;

            float amplitude = 0.5;
            FBM_NOISE_TYPE total = FBM_NOISE_TYPE(0.0);
            float normalization = 0.0;

            for (int i = 0; i < FBM_OCTAVES; ++i) {
                float noiseValue = FBM_NOISE3_TILABLE_FNC(p, tileLength * lacunarity * 0.5) * 0.5 + 0.5;
                total += noiseValue * amplitude;
                normalization += amplitude;
                amplitude *= persistence;
                p = p * lacunarity;
            }

            return total / normalization;
        }
        #endif

        void main() {
          vUv = uv;
          vDisplacement = fbm(position*(0.0 + 1.0/u_scale) + vec3(u_time*u_speed));
          vec3 newPosition = position + normal * vDisplacement*u_intensity;
          vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;
          gl_Position = projectedPosition;
        }
      `,
      wireframe: false, 
      wireframeLinewidth: 0,
      dithering: false,
      flatShading: true,
      doubleSided: true,
      glslVersion: "100"
    });
  }, []);

  return (
    <mesh
      ref={mesh}
      position={[0, 0, 0]}
      scale={50}
      rotation={[0, 0, 0]}
    >
      <planeGeometry args={[1, 1, 1024, 1024]} />
      <primitive object={shaderMaterial} />
    </mesh>
  );
};

const NoiseTexture = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        gl={{
          preserveDrawingBuffer: true,
          premultipliedAlpha: false,
          alpha: true,
          transparent: true,
          antialias: true,
          precision: "highp",
          powerPreference: "high-performance"
        }}
        resize={{
          debounce: 0,
          scroll: false,
          offsetSize: true
        }}
        dpr={1}
        camera={{
          fov: 75,
          near: 0.1,
          far: 1000,
          position: [0, 0, 24]
        }}
        style={{ height: "100%", width: "100%" }}
      >
        <TextureMesh />
      </Canvas>
    </div>
  );
};

export default NoiseTexture;
