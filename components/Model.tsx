// components/Model.tsx
import { useGLTF } from '@react-three/drei'
import { GroupProps } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Mesh>
  materials: Record<string, THREE.Material>
}

interface ModelProps extends GroupProps {
  url: string
}

export function Model({ url, ...props }: ModelProps) {
  const { nodes, materials, scene } = useGLTF(url) as GLTFResult
  
  // You can access specific parts of your model like this:
  // return <mesh geometry={nodes.yourMesh.geometry} material={materials.yourMaterial} />
  
  // Or simply return the entire scene:
  return <primitive object={scene} {...props} />
}

// Preload the model (optional but recommended)
useGLTF.preload('/public/models/ring.glb')