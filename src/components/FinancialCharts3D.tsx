import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Environment, ContactShadows, Line } from '@react-three/drei';
import * as THREE from 'three';

const Bar = ({ position, height, color, label, delay = 0, isGrowth = false }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  const targetScale = useRef(new THREE.Vector3(1, 0.01, 1));

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      if (time > delay) {
        targetScale.current.y = THREE.MathUtils.lerp(targetScale.current.y, Math.abs(height), 0.05);
        meshRef.current.scale.copy(targetScale.current.y < 0.05 ? new THREE.Vector3(1, 0.01, 1) : targetScale.current);
        const yOffset = height < 0 ? -targetScale.current.y / 2 : targetScale.current.y / 2;
        meshRef.current.position.y = position[1] + yOffset;
      }
      
      const targetColor = new THREE.Color(hovered ? '#e0f2fe' : color);
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
        <boxGeometry args={[0.6, 1, 0.6]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
      </mesh>
      <Text
        position={[0, height > 0 ? height + 0.5 : height - 0.5, 0]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
      {isGrowth && (
        <Text
          position={[0, height > 0 ? height + 0.2 : height - 0.2, 0.4]}
          fontSize={0.2}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {height > 0 ? `+${height * 10}%` : `${height * 10}%`}
        </Text>
      )}
    </group>
  );
};

const LineChart3D = () => {
  const points = [
    new THREE.Vector3(-3, 0.5, 0),
    new THREE.Vector3(-1.5, 1.2, 0),
    new THREE.Vector3(0, 1.5, 0),
    new THREE.Vector3(1.5, 2.5, 0),
    new THREE.Vector3(3, 4.2, 0),
  ];

  return (
    <group position={[0, -1, 0]}>
      <Line
        points={points}
        color="#38bdf8"
        lineWidth={3}
        dashed={false}
      />
      {points.map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
};

export const ProfitabilityChart3D = () => {
  const data = [
    { month: 'Q1', value: -1.2, color: '#f87171', delay: 0 },
    { month: 'Q2', value: 0.5, color: '#38bdf8', delay: 0.5 },
    { month: 'Q3', value: 2.8, color: '#818cf8', delay: 1.0 },
    { month: 'Q4', value: 4.5, color: '#34d399', delay: 1.5 },
  ];

  return (
    <div className="w-full h-[300px] relative bg-zinc-900/30 border border-white/10">
      <Canvas camera={{ position: [0, 4, 8], fov: 40 }} shadows>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
          <group position={[-2, 0, 0]}>
            {data.map((item, index) => (
              <Bar
                key={index}
                position={[index * 1.5, 0, 0]}
                height={item.value}
                color={item.color}
                label={item.month}
                delay={item.delay}
              />
            ))}
          </group>
        </Float>
        
        <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={15} blur={2} far={5} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
      </Canvas>
      <div className="absolute top-4 left-6 pointer-events-none">
        <h3 className="text-[10px] opacity-40 uppercase tracking-widest mb-1">PROFITABILITY</h3>
        <p className="text-xl font-light text-white">Breakeven & Margin</p>
      </div>
    </div>
  );
};

export const GrowthChart3D = () => {
  return (
    <div className="w-full h-[300px] relative bg-zinc-900/30 border border-white/10">
      <Canvas camera={{ position: [5, 3, 6], fov: 40 }} shadows>
        <ambientLight intensity={0.5} />
        <spotLight position={[-5, 5, 5]} intensity={1.5} color="#818cf8" castShadow />
        
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
          <LineChart3D />
        </Float>
        
        <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={15} blur={2} far={5} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={-1} />
      </Canvas>
      <div className="absolute top-4 left-6 pointer-events-none">
        <h3 className="text-[10px] opacity-40 uppercase tracking-widest mb-1">OPERATIONAL GROWTH</h3>
        <p className="text-xl font-light text-white">Efficiency Scale</p>
      </div>
    </div>
  );
};
