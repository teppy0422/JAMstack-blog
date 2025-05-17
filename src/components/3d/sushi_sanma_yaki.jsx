import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export default function Model(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF("/images/3d/sushi_sanma_yaki.glb");
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene" position={[0, -1.3, 0]} scale={5.5}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.getavox.geometry}
          material={materials["palette.003"]}
          position={[0, 0.07, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.22}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.sanma_1.geometry}
          material={materials.sanma}
          position={[0, 0.11, -0.03]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.05}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/images/3d/sushi_sanma_yaki.glb");
