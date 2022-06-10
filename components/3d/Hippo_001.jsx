/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export default function Model(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF("/images/3d/hippo_001.glb");
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <mesh
          name="hippo_001_04"
          castShadow
          receiveShadow
          geometry={nodes.hippo_001_04.geometry}
          material={materials.palette}
          position={[0, -3, 2]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={1.5}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/images/3d/hippo_001.glb");