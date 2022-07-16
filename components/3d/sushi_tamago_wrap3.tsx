import { NextPage } from "next";
import { useRef, useState } from "react";
import { Mesh, Vector3, WebGLRenderer, Scene, OrthographicCamera } from "three";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Box } from "@chakra-ui/react";

import Model from "./sushi_umeboshi";
import RenderResult from "next/dist/server/render-result";

const Rig = ({ v = new Vector3() }) => {
  return useFrame((state) => {
    state.camera.position.lerp(v.set(state.mouse.x / 2, -10, 200), 0);
  });
};

const sushi_tamago_wrap = () => (
  <Box
    w={["350px", "380px", "410px", "446px"]}
    h={["200px", "260px", "280px", "300px"]}
    display="inline-block"
  >
    <Canvas>
      <ambientLight intensity={1.5} />
      <directionalLight position={[0, 0, -0]} intensity={1} />
      <OrbitControls
        autoRotate={true}
        autoRotateSpeed={4}
        enableZoom={true}
        zoomSpeed={1}
        enablePan={false}
        enableDamping={true} //惰性
        maxZoom={3}
        minZoom={0.1}
      />
      <Rig />
      <Model />
    </Canvas>
  </Box>
);

export default sushi_tamago_wrap;
