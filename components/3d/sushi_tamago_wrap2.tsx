import { NextPage } from "next";
import { useRef, useState } from "react";
import { Mesh, Vector3, WebGLRenderer, Scene, OrthographicCamera } from "three";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Box } from "@chakra-ui/react";

import Model from "./sushi_ootoro";
import RenderResult from "next/dist/server/render-result";

const Rig = ({ v = new Vector3() }) => {
  return useFrame((state) => {
    state.camera.position.lerp(v.set(state.mouse.x / 2, -10, 100), 0);
  });
};

const sushi_tamago_wrap = () => (
  <Box
    w={"100%"}
    h={["160px", "180px", "210px", "210px"]}
    display="inline-block"
  >
    <Canvas>
      <ambientLight intensity={2} />
      <directionalLight position={[0, 0, -10]} intensity={1} />
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
