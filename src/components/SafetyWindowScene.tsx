import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Environment, Text, useCursor, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

const CustomerAndWindow = () => {
  const [active, setActive] = useState(false);
  useCursor(active);
  const trayRef = useRef<THREE.Mesh>(null);
  const productRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (trayRef.current && productRef.current) {
      // Animate the tray sliding out when active
      const targetZ = active ? 0.8 : 0;
      trayRef.current.position.z = THREE.MathUtils.lerp(trayRef.current.position.z, targetZ, 0.1);
      
      // Animate the product inside the tray
      productRef.current.position.z = trayRef.current.position.z;
    }
  });

  return (
    <group position={[0, -1, 0]}>
      {/* Wall */}
      <Box args={[6, 4, 0.5]} position={[0, 2, 0]} receiveShadow>
        <meshStandardMaterial color="#111" />
      </Box>

      {/* Glass Window */}
      <Box args={[3, 2, 0.2]} position={[0, 2.5, 0.25]} castShadow>
        <MeshTransmissionMaterial 
          backside
          thickness={0.1}
          roughness={0}
          transmission={1}
          ior={1.5}
          color="#e0f2fe"
        />
      </Box>

      {/* Interaction Target (Button/Trigger on the outside) */}
      <group position={[1, 1.8, 0.3]}>
        <Box 
          args={[0.3, 0.4, 0.1]} 
          onPointerOver={() => setActive(true)} 
          onPointerOut={() => setActive(false)}
        >
          <meshStandardMaterial color={active ? "#38bdf8" : "#333"} />
        </Box>
        <Text position={[0, 0, 0.06]} fontSize={0.06} color="#fff">
          {active ? "FULFILLING" : "REQUEST"}
        </Text>
      </group>

      {/* The Secure Tray */}
      <Box ref={trayRef as any} args={[1.5, 0.1, 1]} position={[0, 1.5, 0]} castShadow>
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </Box>

      {/* The Product (appears when tray slides out) */}
      <Box ref={productRef as any} args={[0.3, 0.4, 0.2]} position={[0, 1.75, 0]} castShadow>
        <meshStandardMaterial color="#ef4444" />
      </Box>

      {/* Abstract Customer Representation */}
      <group position={[0, 1.5, 2]}>
        <Sphere args={[0.3]} position={[0, 1.5, 0]} castShadow>
          <meshStandardMaterial color="#818cf8" />
        </Sphere>
        <Box args={[0.8, 1.2, 0.4]} position={[0, 0.6, 0]} castShadow>
          <meshStandardMaterial color="#6366f1" />
        </Box>
      </group>
    </group>
  );
};

export const SafetyWindowScene = () => {
  return (
    <div className="w-full h-[400px] relative bg-gradient-to-b from-transparent to-sky-950/20 border border-white/10">
      <Canvas camera={{ position: [3, 2, 4], fov: 45 }} shadows>
        <ambientLight intensity={0.2} />
        <spotLight position={[2, 5, 4]} intensity={2} color="#38bdf8" castShadow angle={0.6} penumbra={0.5} />
        <pointLight position={[0, 2.5, -2]} intensity={1} color="#fff" /> {/* Light inside store */}
        
        <CustomerAndWindow />
        <Environment preset="night" />
        <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} minAzimuthAngle={-Math.PI/4} maxAzimuthAngle={Math.PI/4} />
      </Canvas>
      <div className="absolute bottom-4 left-8 pointer-events-none">
        <p className="text-[10px] tracking-widest text-sky-400 mb-1 uppercase">FIG. 02 // Night-Portal Interaction</p>
        <p className="text-sm font-light text-white">Hover "REQUEST" to simulate secure transaction.</p>
      </div>
    </div>
  );
};
