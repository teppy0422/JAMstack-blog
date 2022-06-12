import { NextPage } from "next";
import { useRef, useState } from "react";
import { Mesh, Vector3, WebGLRenderer, Scene, OrthographicCamera } from "three";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Box } from "@chakra-ui/react";

import Model from "./table";
import RenderResult from "next/dist/server/render-result";

const Rig = ({ v = new Vector3() }) => {
  return useFrame((state) => {
    state.camera.position.lerp(v.set(state.mouse.x / 2, -10, 100), 0);
  });
};

const Table = () => (
  <Box
    w={["300px", "290px", "330px", "360px"]}
    h={["300px", "320px", "350px", "380px"]}
    display="inline-block"
  >
    <Canvas>
      <ambientLight intensity={0.75} />
      <directionalLight position={[0, 0, -10]} intensity={0.4} />
      <OrbitControls
        autoRotate={false}
        autoRotateSpeed={0}
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

export default Table;
