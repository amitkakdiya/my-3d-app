'use client';

import { useEffect, useRef, useState, Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { Leva, useControls } from 'leva';
import { diamondMaterials } from '@/config/materials';

const metalMaterials: Record<string, THREE.MeshStandardMaterial> = {
  yellow: new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1, roughness: 0.2 }),
  white: new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.2 }),
  rose: new THREE.MeshStandardMaterial({ color: 0xffc0cb, metalness: 1, roughness: 0.2 })
};

const hdriFiles: Record<string, string> = {
  studio_7: '/hdr/studio_small_07_1k.hdr',
  studio_8: '/hdr/studio_small_08_1k.hdr',
  studio_9: '/hdr/studio_small_09_1k.hdr',
  venice_sunset: '/hdr/venice_sunset_1k.hdr'
};

function JewelryModel({ metal, diamondMaterial }: { metal: string; diamondMaterial: THREE.MeshPhysicalMaterial }) {
  const { scene } = useGLTF('/models/ring.glb');

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.Material;

        if (
          mesh.name.toLowerCase().includes('gemcenter') ||
          (mat as any)?.transmission > 0.8 ||
          (mat as any)?.ior >= 2.0
        ) {
          mesh.material = diamondMaterial;
          console.log('🔹 Assigned Diamond Material to', mesh.name);
        } else {
          mesh.material = metalMaterials[metal];
          console.log('🔸 Assigned Metal Material to', mesh.name);
        }
      }
    });
  }, [scene, metal, diamondMaterial]);

  return <primitive object={scene} />;
}

export default function Home() {
  const [metal, setMetal] = useState('yellow');
  const [shape, setShape] = useState<'RND' | 'OVL' | 'PRN'>('RND');
  const [hdr, setHDR] = useState('studio_7');

  const shapeKeyMap: Record<'RND' | 'OVL' | 'PRN', keyof typeof diamondMaterials> = {
    RND: 'RND',
    OVL: 'PRINCESS',
    PRN: 'PRINCESS'
  };

  const diamondMaterial = useMemo(() => {
    const shapeMat = diamondMaterials[shapeKeyMap[shape]];
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(`#${shapeMat.color}`),
      metalness: 0,
      roughness: 0,
      transmission: 1,
      transparent: true,
      ior: shapeMat.refractionIndex,
      thickness: 0.5,
      reflectivity: 1
    });
  }, [shape]);

  const { ambientIntensity, directIntensity, exposure } = useControls('Lighting', {
    ambientIntensity: { value: 0.3, min: 0, max: 2, step: 0.1 },
    directIntensity: { value: 2.5, min: 0, max: 5, step: 0.1 },
    exposure: { value: 1, min: 0.1, max: 3, step: 0.1 }
  });

  return (
    <div style={{ height: '100vh', width: '100vw', backgroundColor: 'black' }}>
      <Leva collapsed />
      <div style={{ position: 'absolute', zIndex: 10, top: 10, left: 10, background: '#fff', padding: 10 }}>
        <div style={{ marginBottom: 8 }}>
          <label>
            Metal Color:{' '}
            <select value={metal} onChange={(e) => setMetal(e.target.value)}>
              <option value="yellow">Yellow Gold</option>
              <option value="white">White Gold</option>
              <option value="rose">Rose Gold</option>
            </select>
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>
            Diamond Shape:{' '}
            <select value={shape} onChange={(e) => setShape(e.target.value as any)}>
              <option value="RND">Round</option>
              <option value="OVL">Oval</option>
              <option value="PRN">Princess</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            HDR:{' '}
            <select value={hdr} onChange={(e) => setHDR(e.target.value)}>
              <option value="studio_7">Studio 7</option>
              <option value="studio_8">Studio 8</option>
              <option value="studio_9">Studio 9</option>
              <option value="venice_sunset">Venice Sunset</option>
            </select>
          </label>
        </div>
      </div>

      <Canvas camera={{ position: [0, 2, 4], fov: 45 }} gl={{ toneMappingExposure: exposure }} shadows>
        <ambientLight intensity={ambientIntensity} />
        <directionalLight position={[5, 10, 7.5]} intensity={directIntensity} />
        <Suspense fallback={null}>
          <Environment files={hdriFiles[hdr]} background={false} />
        </Suspense>
        <OrbitControls enableDamping autoRotate={true} autoRotateSpeed={0.5} />
        <JewelryModel metal={metal} diamondMaterial={diamondMaterial} />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/models/ring.glb');
