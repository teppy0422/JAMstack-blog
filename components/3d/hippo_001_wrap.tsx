import { NextPage } from "next";
import { useRef, useState } from "react";
import { Mesh, Vector3, WebGLRenderer, Scene, OrthographicCamera } from "three";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@chakra-ui/react";

import Hippo_001 from "./Hippo_001";
import RenderResult from "next/dist/server/render-result";

const Rig = ({ v = new Vector3() }) => {
  return useFrame((state) => {
    state.camera.position.lerp(v.set(state.mouse.x / 2, -10, 100), 0);
  });
};

const Hippo_001_wrap = () => (
  <div style={{ width: "100vw", height: "100vh" }}>
    <Canvas>
      <ambientLight intensity={0.45} />
      <directionalLight position={[0, 0, -10]} intensity={0.4} />
      <OrbitControls
        autoRotate={true}
        autoRotateSpeed={5}
        enableZoom={true}
        zoomSpeed={1}
        enablePan={false}
        enableDamping={true} //惰性
        maxZoom={3}
        minZoom={0.1}
      />
      <Rig />
      <Hippo_001 />
    </Canvas>
  </div>
);

export default Hippo_001_wrap;
