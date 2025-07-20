// // // pages/index.tsx
// // import { Canvas } from '@react-three/fiber'
// // import { OrbitControls, Environment } from '@react-three/drei'
// // import { Model } from '../components/Model'

// // export default function Home() {
// //   return (
// //     <div style={{ height: '100vh', width: '100vw' }}>
// //       <Canvas>
// //         <ambientLight intensity={0.5} />
// //         <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
// //         <pointLight position={[-10, -10, -10]} />
        
// //         <Model url="/path/to/your/model.glb" position={[0, -1, 0]} />
// //         <OrbitControls />
        
// //         {/* Optional environment */}
// //         <Environment preset="city" />
// //       </Canvas>
// //     </div>
// //   )
// // }

// Add New Lighting and Environment
// 📁 /pages/index.tsx

'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { Leva, useControls } from 'leva';
import { diamondMaterials } from '@/config/materials';


const RND = diamondMaterials.RND;

const diamondMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color(`#${RND.color}`),
  metalness: 0,
  roughness: 0,
  transmission: 1,
  transparent: true,
  ior: RND.refractionIndex,
  thickness: 0.5,
  reflectivity: 1,
});

const metalMaterials: Record<string, THREE.MeshStandardMaterial> = {
  yellow: new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1, roughness: 0.2 }),
  white: new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.2 }),
  rose: new THREE.MeshStandardMaterial({ color: 0xffc0cb, metalness: 1, roughness: 0.2 })
};

function JewelryModel({ metal }: { metal: string }) {
  const { scene } = useGLTF('/models/ring.glb');

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.Material;

        if (mesh.name.toLowerCase().includes('gemcenter') ||
          (mat as any)?.transmission > 0.8 ||
          (mat as any)?.ior >= 2.0) {
          mesh.material = diamondMaterial;
          console.log('🔹 Assigned Diamond Material to', mesh.name);
        }

        if (mesh.name.toLowerCase().includes('gemcenter') ||
          (mat as any)?.transmission > 0.8 ||
          (mat as any)?.ior >= 2.0) {
          mesh.material = diamondMaterial;
          console.log('🔹 Assigned Diamond Material to', mesh.name);
        }

        if (mesh.name.toLowerCase().includes('diamond') ||
          (mat as any)?.transmission > 0.8 ||
          (mat as any)?.ior >= 2.0) {
          mesh.material = diamondMaterial;
        } else {
           mesh.material = metalMaterials[metal];
           console.log('🔸 Assigned Metal Material to', mesh.name);
        }
      }
    });
  }, [scene, metal]);

  return <primitive object={scene} />;
}

export default function Home() {
  const [metal, setMetal] = useState('yellow');

  const { environment, ambientIntensity, directIntensity, exposure } = useControls('Lighting', {
    environment: {
      options: ['studio', 'sunset', 'city', 'dawn', 'night', 'forest', 'apartment', 'warehouse'],
      value: 'studio',
    },
    ambientIntensity: { value: 0.3, min: 0, max: 2, step: 0.1 },
    directIntensity: { value: 2.5, min: 0, max: 5, step: 0.1 },
    exposure: { value: 1, min: 0.1, max: 3, step: 0.1 },
  });

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Leva collapsed />
      <div style={{ position: 'absolute', zIndex: 10, top: 10, left: 10, background: '#fff', padding: 10 }}>
        <label>
          Metal Color:{' '}
          <select value={metal} onChange={(e) => setMetal(e.target.value)}>
            <option value="yellow">Yellow Gold</option>
            <option value="white">White Gold</option>
            <option value="rose">Rose Gold</option>
          </select>
        </label>
      </div>

      {/* <Canvas camera={{ position: [0, 2, 4], fov: 45 }} gl={{ toneMappingExposure: exposure }} shadows>
        <ambientLight intensity={ambientIntensity} />
        <directionalLight position={[5, 10, 7.5]} intensity={directIntensity} />
        <Environment preset={environment as any} background />
        <OrbitControls enableDamping />
        <JewelryModel metal={metal} />
      </Canvas> */}

      <Canvas camera={{ position: [0, 2, 4], fov: 45 }} 
      gl={{ toneMappingExposure: exposure }} shadows>
  <ambientLight intensity={ambientIntensity} />
  <directionalLight position={[5, 10, 7.5]} intensity={directIntensity} />
  <Environment preset={environment as any} background />
  <OrbitControls enableDamping autoRotate={true} autoRotateSpeed={0.5} />
  <JewelryModel metal={metal} />
   <ambientLight intensity={ambientIntensity} />
        <directionalLight position={[5, 10, 7.5]} intensity={directIntensity} />
        <Environment preset={environment as any} background />
        <OrbitControls enableDamping />
        <JewelryModel metal={metal} />
</Canvas>
    </div>
  );
}

useGLTF.preload('/models/ring.glb');
