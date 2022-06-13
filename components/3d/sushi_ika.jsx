/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export default function Model(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF("/images/3d/sushi_ika.glb");
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene" position={[0, -1.3, 0]} scale={1.3}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.shari.geometry}
          material={materials.shari}
          position={[0.02, 0.96, 0.03]}
          rotation={[0, 1.57, 0]}
          scale={[0.45, 0.45, 0.45]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.ika.geometry}
          material={materials["マテリアル.003"]}
          position={[0.02, 1.24, 0.03]}
          rotation={[0, 1.57, 0]}
          scale={[0.45, 0.45, 0.45]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.getavox.geometry}
          material={materials["palette.003"]}
          position={[0.05, 0.33, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/images/3d/sushi_ika.glb");
