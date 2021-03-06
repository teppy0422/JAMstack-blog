/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export default function Model(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF("/images/3d/sushi_amaebi.glb");
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene" position={[0, -1.3, 0]} scale={9}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube013.geometry}
          material={materials.ebi}
          position={[0, 0.18, -0.01]}
          rotation={[0.02, 0, 0]}
        >
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube012.geometry}
            material={materials.kome}
            position={[0, -0.09, 0.01]}
            rotation={[-0.03, -0.02, 0]}
          />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.getavox.geometry}
          material={materials["palette.005"]}
          position={[0, 0.06, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.17}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/images/3d/sushi_amaebi.glb");
