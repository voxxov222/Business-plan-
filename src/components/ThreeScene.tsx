import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const Bar = ({ position, height, color, label, delay = 0 }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  const targetScale = useRef(new THREE.Vector3(1, 0.01, 1));

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      if (time > delay) {
        targetScale.current.y = THREE.MathUtils.lerp(targetScale.current.y, height, 0.05);
        meshRef.current.scale.copy(targetScale.current.y < 0.05 ? new THREE.Vector3(1, 0.01, 1) : targetScale.current);
        meshRef.current.position.y = position[1] + targetScale.current.y / 2;
      }
      
      const targetColor = new THREE.Color(hovered ? '#60a5fa' : color);
      (meshRef.current.material as THREE.MeshStandardMaterial).color.lerp(targetColor, 0.1);
    }
  });

  return (
    <group position={[position[0], 0, position[2]]}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.8, 1, 0.8]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
      </mesh>
      <Text
        position={[0, height + 0.5, 0]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {label}
      </Text>
    </group>
  );
};

export const ThreeScene = () => {
  const data = [
    { year: 'Year 1', value: 2.5, color: '#0ea5e9', delay: 0 },
    { year: 'Year 2', value: 3.8, color: '#38bdf8', delay: 0.5 },
    { year: 'Year 3', value: 5.2, color: '#7dd3fc', delay: 1.0 },
    { year: 'Year 4', value: 7.0, color: '#818cf8', delay: 1.5 },
    { year: 'Year 5', value: 9.5, color: '#6366f1', delay: 2.0 },
  ];

  return (
    <div className="w-full h-full min-h-[400px] relative">
      <Canvas camera={{ position: [5, 5, 8], fov: 45 }} shadows>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
        <spotLight position={[-10, 10, -10]} intensity={1} color="#38bdf8" />
        
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <group position={[-2.5, -2, 0]}>
            {data.map((item, index) => (
              <Bar
                key={index}
                position={[index * 1.5, 0, 0]}
                height={item.value}
                color={item.color}
                label={item.year}
                delay={item.delay}
              />
            ))}
          </group>
        </Float>
        
        <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={20} blur={2} far={10} />
        <Environment preset="city" />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 2 - 0.1} />
      </Canvas>
    </div>
  );
};
