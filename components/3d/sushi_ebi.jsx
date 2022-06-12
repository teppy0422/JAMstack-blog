/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export default function Model(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF("/images/3d/sushi_ebi.glb");
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <mesh
          name="sushi_ebivox"
          castShadow
          receiveShadow
          geometry={nodes.sushi_ebivox.geometry}
          material={materials["palette.001"]}
          rotation={[Math.PI / 2, 0, 0]}
        />
      </group>
    </group>
  );
}
useGLTF.preload("/images/3d/sushi_ebi.glb");
