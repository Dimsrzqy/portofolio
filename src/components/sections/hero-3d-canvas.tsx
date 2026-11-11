"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function FloatingShape() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const wireframeRef = useRef<THREE.LineSegments>(null!);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.25;
      meshRef.current.rotation.y += delta * 0.35;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x += delta * 0.25;
      wireframeRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={0.8}>
      <group scale={1.8}>
        {/* Core solid faceted icosahedron */}
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#6366f1"
            roughness={0.2}
            metalness={0.8}
            wireframe={false}
          />
        </mesh>
        {/* Subtle outer geometric wireframe */}
        <lineSegments ref={wireframeRef}>
          <edgesGeometry args={[new THREE.IcosahedronGeometry(1.02, 0)]} />
          <lineBasicMaterial color="#a5b4fc" transparent opacity={0.6} />
        </lineSegments>
      </group>
    </Float>
  );
}

export default function Hero3DCanvas() {
  return (
    <div className="w-full h-full min-h-[260px] sm:min-h-[320px] lg:min-h-[380px] flex items-center justify-center relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#818cf8" />
        <FloatingShape />
      </Canvas>
    </div>
  );
}
