import { NextPage } from "next";
import { useRef, useState } from "react";
import { Mesh, Vector3 } from "three";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@chakra-ui/react";

import Hippo_001 from "../components/3d/Hippo_001";

const Rig = ({ v = new Vector3() }) => {
  return useFrame((state) => {
    // state.camera.position.lerp(v.set(state.mouse.x / 2, 5, 10), 0.05);
  });
};

const Home = () => (
  <div style={{ width: "100vw", height: "100vh" }}>
    <Canvas>
      <ambientLight intensity={1} />
      {/* <directionalLight position={[5, 5, 2]} intensity={1} /> */}

      <OrbitControls
        autoRotate={true}
        autoRotateSpeed={10}
        enableZoom={true}
        enablePan={false}
        enableDamping={true} //惰性
        maxZoom={3}
      />
      <Rig />
      <Hippo_001 />
    </Canvas>
  </div>
);

export default Home;
