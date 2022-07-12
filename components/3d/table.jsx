/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export default function Model(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF("/images/3d/table.glb");
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group
          name="スポット"
          position={[2.15, 4.19, 0.23]}
          rotation={[-0.02, -0.36, -0.04]}
        >
          <spotLight
            name="スポット_Orientation"
            intensity={3}
            angle={0.58}
            penumbra={0.15}
            decay={2}
            color="#ffea3b"
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <group position={[0, 0, -1]} />
          </spotLight>
        </group>
        <mesh
          name="table002"
          castShadow
          receiveShadow
          geometry={nodes.table002.geometry}
          material={materials["palette.005"]}
          position={[0.08, 0, 0.07]}
          rotation={[Math.PI / 1.6, 0, 0]}
          scale={1.45}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/images/3d/table.glb");
