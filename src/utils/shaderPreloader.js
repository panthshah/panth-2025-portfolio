import * as THREE from 'three';
import { TEXTURE_CONFIGS } from '../components/textures/UnifiedTexture';

// Pre-compile shaders to avoid loading delays
export const precompileShaders = () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(1, 1); // Minimal size for compilation
  
  const materials = [];
  const meshes = [];

  // Create materials for each theme configuration
  Object.entries(TEXTURE_CONFIGS).forEach(([themeName, config]) => {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_intensity: { value: config.intensity },
        u_colors: { 
          value: config.colors.map(color => new THREE.Vector4(color.r, color.g, color.b, color.a))
        },
        u_speed: { value: config.speed },
        u_scale: { value: config.scale },
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
        
        void main() {
          float distort = vDisplacement * u_intensity;
          vec2 val = abs(vUv - 0.5) * 3.0 * (1.0 - distort);
          vec4 color = vec4(vec3(val, u_colors[0].b), 1.0);
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
        
        // Optimized noise functions
        float mod289(float x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        
        float permute(float x) { return mod289(((x * 34.0) + 1.0) * x); }
        vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
        vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
        
        float taylorInvSqrt(float r) { return 1.79284291400159 - 0.85373472095314 * r; }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        
        float quintic(float v) { return v*v*v*(v*(v*6.0-15.0)+10.0); }
        vec3 quintic(vec3 v) { return v*v*v*(v*(v*6.0-15.0)+10.0); }
        
        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          
          vec3 i = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          
          i = mod289(i);
          vec4 p = permute(permute(permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                  + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          
          vec4 x = x_ * ns.x + ns.yyyy;
          vec4 y = y_ * ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          
          vec4 s0 = floor(b0) * 2.0 + 1.0;
          vec4 s1 = floor(b1) * 2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          
          vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
          
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          
          vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;
          
          vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
        }
        
        float fbm(vec3 p) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < 4; i++) {
            value += amplitude * snoise(p);
            p *= 2.0;
            amplitude *= 0.5;
          }
          return value;
        }
        
        void main() {
          vUv = uv;
          vDisplacement = fbm(position * (0.0 + 1.0/u_scale) + vec3(u_time * u_speed));
          vec3 newPosition = position + normal * vDisplacement * u_intensity;
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

    materials.push(material);
    
    // Create mesh and add to scene
    const geometry = new THREE.PlaneGeometry(1, 1);
    const mesh = new THREE.Mesh(geometry, material);
    meshes.push(mesh);
    scene.add(mesh);
  });

  // Render once to compile shaders
  renderer.render(scene, camera);
  
  // Clean up
  renderer.dispose();
  meshes.forEach(mesh => {
    mesh.geometry.dispose();
  });
  materials.forEach(material => {
    material.dispose();
  });
  
  console.log(`Shaders pre-compiled successfully for ${Object.keys(TEXTURE_CONFIGS).length} themes`);
};
