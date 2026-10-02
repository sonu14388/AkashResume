import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';

export type ThreeDMode = 'home' | 'builder' | 'templates' | 'dashboard';

interface ThreeDStageProps {
  mode: ThreeDMode;
}

interface StageContentProps {
  mode: ThreeDMode;
}

interface Palette {
  primary: string;
  secondary: string;
  glow: string;
  grid: string;
}

const PALETTES: Record<ThreeDMode, Palette> = {
  home: {
    primary: '#ee6424',
    secondary: '#f7b267',
    glow: '#ffd6a5',
    grid: '#6d2e12'
  },
  builder: {
    primary: '#f97316',
    secondary: '#fbbf78',
    glow: '#fed7aa',
    grid: '#673216'
  },
  templates: {
    primary: '#fb923c',
    secondary: '#fcd34d',
    glow: '#ffedd5',
    grid: '#75431e'
  },
  dashboard: {
    primary: '#ea580c',
    secondary: '#fdba74',
    glow: '#ffedd5',
    grid: '#653219'
  }
};

const usePointerParallax = () => {
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      target.current.x = event.clientX / window.innerWidth - 0.5;
      target.current.y = event.clientY / window.innerHeight - 0.5;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  return target;
};

const useReducedMotion = () => {
  const reducedMotion = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      reducedMotion.current = mediaQuery.matches;
    };

    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return reducedMotion;
};

const HolographicResumePanel: React.FC<{ palette: Palette }> = ({ palette }) => {
  const panelGeometry = useMemo(() => new THREE.BoxGeometry(3.7, 2.35, 0.14), []);

  useEffect(() => () => panelGeometry.dispose(), [panelGeometry]);

  return (
    <Float speed={1.1} rotationIntensity={0.16} floatIntensity={0.26}>
      <group position={[0, 0.1, -0.45]} rotation={[0.08, -0.24, 0.03]}>
        <mesh geometry={panelGeometry}>
          <meshStandardMaterial
            color="#0c1730"
            metalness={0.72}
            roughness={0.24}
            transparent
            opacity={0.94}
          />
        </mesh>

        <mesh position={[-1.25, 0.78, 0.1]}>
          <boxGeometry args={[1.1, 0.09, 0.035]} />
          <meshBasicMaterial color={palette.primary} />
        </mesh>
        <mesh position={[-1.42, 0.57, 0.1]}>
          <boxGeometry args={[0.76, 0.045, 0.03]} />
          <meshBasicMaterial color={palette.secondary} />
        </mesh>
        <mesh position={[0.88, 0.62, 0.1]}>
          <boxGeometry args={[0.52, 0.5, 0.04]} />
          <meshStandardMaterial
            color={palette.glow}
            emissive={palette.glow}
            emissiveIntensity={0.42}
            transparent
            opacity={0.84}
          />
        </mesh>

        {[0.22, 0.02, -0.18, -0.38, -0.58].map((y, index) => (
          <group key={y}>
            <mesh position={[-0.98, y, 0.1]}>
              <boxGeometry args={[1.5 - index * 0.11, 0.035, 0.025]} />
              <meshBasicMaterial color="#94a3b8" transparent opacity={0.52} />
            </mesh>
            <mesh position={[0.69, y, 0.1]}>
              <boxGeometry args={[0.43, 0.035, 0.025]} />
              <meshBasicMaterial color={palette.secondary} transparent opacity={0.72} />
            </mesh>
          </group>
        ))}

        <mesh position={[0, -0.92, 0.12]}>
          <boxGeometry args={[3.05, 0.025, 0.025]} />
          <meshBasicMaterial color={palette.primary} transparent opacity={0.72} />
        </mesh>
      </group>
    </Float>
  );
};

const OrbitalRing: React.FC<{ palette: Palette; position: [number, number, number]; scale: number }> = ({
  palette,
  position,
  scale
}) => (
  <mesh position={position} rotation={[0.65, 0.2, 0.4]} scale={scale}>
    <torusGeometry args={[0.72, 0.018, 16, 80]} />
    <meshBasicMaterial color={palette.secondary} transparent opacity={0.68} />
  </mesh>
);

const StageContent: React.FC<StageContentProps> = ({ mode }) => {
  const palette = PALETTES[mode];
  const rig = useRef<THREE.Group>(null);
  const orb = useRef<THREE.Mesh>(null);
  const pointerTarget = usePointerParallax();
  const reducedMotion = useReducedMotion();

  useFrame((state, delta) => {
    if (!rig.current || !orb.current) return;

    const motionFactor = reducedMotion.current ? 0.08 : 1;
    rig.current.rotation.y = THREE.MathUtils.lerp(
      rig.current.rotation.y,
      pointerTarget.current.x * 0.24,
      0.035 * motionFactor
    );
    rig.current.rotation.x = THREE.MathUtils.lerp(
      rig.current.rotation.x,
      -pointerTarget.current.y * 0.18,
      0.035 * motionFactor
    );
    rig.current.position.x = THREE.MathUtils.lerp(
      rig.current.position.x,
      pointerTarget.current.x * 0.34,
      0.025 * motionFactor
    );
    rig.current.position.y = THREE.MathUtils.lerp(
      rig.current.position.y,
      -pointerTarget.current.y * 0.22,
      0.025 * motionFactor
    );

    orb.current.rotation.x += delta * 0.24 * motionFactor;
    orb.current.rotation.y -= delta * 0.31 * motionFactor;
    orb.current.rotation.z += delta * 0.12 * motionFactor;

    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 7.4, 0.02);
  });

  return (
    <>
      <ambientLight intensity={0.78} />
      <directionalLight position={[4, 5, 6]} intensity={2.2} color="#dbeafe" />
      <pointLight position={[-4, 1, 3]} intensity={13} distance={12} color={palette.primary} />
      <pointLight position={[3, -2, 2]} intensity={10} distance={10} color={palette.secondary} />

      <Stars radius={70} depth={38} count={mode === 'builder' ? 420 : 620} factor={1.8} saturation={0.15} fade speed={0.35} />
      <Sparkles
        count={mode === 'builder' ? 70 : 105}
        scale={[13, 8, 10]}
        size={1.65}
        speed={0.3}
        noise={1.4}
        color={palette.glow}
      />

      <group ref={rig}>
        <HolographicResumePanel palette={palette} />

        <mesh ref={orb} position={[0, 0.14, 0.78]}>
          <icosahedronGeometry args={[1.03, 2]} />
          <meshStandardMaterial
            color={palette.primary}
            emissive={palette.primary}
            emissiveIntensity={0.34}
            metalness={0.82}
            roughness={0.18}
            transparent
            opacity={0.62}
          />
        </mesh>
        <mesh position={[0, 0.14, 0.82]} scale={1.09}>
          <icosahedronGeometry args={[1.03, 2]} />
          <meshBasicMaterial color={palette.secondary} wireframe transparent opacity={0.38} />
        </mesh>

        <OrbitalRing palette={palette} position={[1.98, 1.22, -0.15]} scale={0.76} />
        <OrbitalRing palette={palette} position={[-2.08, -1.12, 0.36]} scale={0.58} />

        <Float speed={1.8} rotationIntensity={0.8} floatIntensity={0.72}>
          <mesh position={[2.18, -0.74, 0.1]} rotation={[0.4, 0.55, 0.12]}>
            <octahedronGeometry args={[0.42, 0]} />
            <meshStandardMaterial
              color={palette.secondary}
              emissive={palette.secondary}
              emissiveIntensity={0.48}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        </Float>
      </group>

      <gridHelper args={[15, 30, palette.grid, palette.grid]} position={[0, -2.5, -3.2]} />
    </>
  );
};

export const ThreeDStage: React.FC<ThreeDStageProps> = ({ mode }) => (
  <div className={`three-d-stage three-d-stage--${mode}`} aria-hidden="true">
    <Canvas
      camera={{ position: [0, 0, 7.4], fov: 43 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      fallback={null}
    >
      <color attach="background" args={['#060b18']} />
      <StageContent mode={mode} />
    </Canvas>
    <div className="three-d-stage__vignette" />
    <div className="three-d-stage__scanlines" />
  </div>
);

interface HeroSceneProps {
  palette: Palette;
}

const HeroResumeCard: React.FC<HeroSceneProps> = ({ palette }) => (
  <group position={[-1.48, 0.02, 0.78]} rotation={[0.13, 0.38, -0.2]}>
    <mesh>
      <boxGeometry args={[1.82, 3.2, 0.18]} />
      <meshStandardMaterial color="#181818" metalness={0.7} roughness={0.25} />
    </mesh>
    <mesh position={[0, 0, 0.12]}>
      <boxGeometry args={[1.56, 2.88, 0.035]} />
      <meshStandardMaterial color="#f4c48f" roughness={0.58} />
    </mesh>
    <mesh position={[0, 1.4, 0.15]}>
      <boxGeometry args={[0.5, 0.055, 0.035]} />
      <meshBasicMaterial color="#27211e" />
    </mesh>
    <mesh position={[-0.42, 1.03, 0.15]}>
      <boxGeometry args={[0.78, 0.095, 0.04]} />
      <meshBasicMaterial color={palette.primary} />
    </mesh>
    <mesh position={[-0.41, 0.83, 0.15]}>
      <boxGeometry args={[0.54, 0.045, 0.04]} />
      <meshBasicMaterial color="#6b3a24" transparent opacity={0.8} />
    </mesh>
    <mesh position={[0.35, 0.83, 0.15]}>
      <boxGeometry args={[0.34, 0.32, 0.04]} />
      <meshStandardMaterial
        color={palette.secondary}
        emissive={palette.secondary}
        emissiveIntensity={0.24}
        roughness={0.38}
      />
    </mesh>
    {[0.46, 0.25, 0.04, -0.17, -0.38, -0.59, -0.8, -1.01].map((y, index) => (
      <mesh key={y} position={[-0.37, y, 0.15]}>
        <boxGeometry args={[1.05 - (index % 3) * 0.1, 0.035, 0.032]} />
        <meshBasicMaterial color="#865332" transparent opacity={0.72} />
      </mesh>
    ))}
    <mesh position={[0, -1.38, 0.15]}>
      <boxGeometry args={[1.2, 0.035, 0.032]} />
      <meshBasicMaterial color={palette.primary} transparent opacity={0.78} />
    </mesh>
  </group>
);

const HeroOrb: React.FC<{ palette: Palette; position: [number, number, number]; size: number }> = ({
  palette,
  position,
  size
}) => (
  <Float speed={1.15} rotationIntensity={0.42} floatIntensity={0.55}>
    <group position={position}>
      <mesh>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={palette.primary}
          emissive={palette.primary}
          emissiveIntensity={0.16}
          metalness={0.28}
          roughness={0.28}
        />
      </mesh>
      <mesh rotation={[0.42, -0.3, 0.18]} scale={1.015}>
        <torusGeometry args={[size * 0.74, size * 0.075, 16, 64]} />
        <meshStandardMaterial color={palette.secondary} metalness={0.72} roughness={0.2} />
      </mesh>
    </group>
  </Float>
);

const HeroSceneContent: React.FC = () => {
  const palette = PALETTES.home;
  const rig = useRef<THREE.Group>(null);
  const pointerTarget = usePointerParallax();
  const reducedMotion = useReducedMotion();

  useFrame((state, delta) => {
    if (!rig.current) return;

    const motionFactor = reducedMotion.current ? 0.08 : 1;
    rig.current.rotation.y = THREE.MathUtils.lerp(
      rig.current.rotation.y,
      pointerTarget.current.x * 0.2,
      0.035 * motionFactor
    );
    rig.current.rotation.x = THREE.MathUtils.lerp(
      rig.current.rotation.x,
      -pointerTarget.current.y * 0.16,
      0.035 * motionFactor
    );
    rig.current.position.x = THREE.MathUtils.lerp(
      rig.current.position.x,
      pointerTarget.current.x * 0.28,
      0.025 * motionFactor
    );
    rig.current.position.y = THREE.MathUtils.lerp(
      rig.current.position.y,
      -pointerTarget.current.y * 0.18,
      0.025 * motionFactor
    );

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, pointerTarget.current.x * 0.28, 0.025);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, -pointerTarget.current.y * 0.18, 0.025);
    state.camera.lookAt(0, 0, 0);

    if (!reducedMotion.current) {
      rig.current.rotation.z += delta * 0.012;
    }
  });

  return (
    <>
      <ambientLight intensity={1.15} />
      <directionalLight position={[-4, 5, 7]} intensity={3.4} color="#fff1df" />
      <pointLight position={[-3, 0, 2]} intensity={14} distance={9} color="#ff8a3d" />
      <pointLight position={[3, 1, 1]} intensity={10} distance={8} color="#ffd2a6" />
      <Sparkles count={58} scale={[8.5, 5.5, 7]} size={1.45} speed={0.22} noise={1.2} color="#ffe1c2" />

      <group ref={rig}>
        <HeroResumeCard palette={palette} />

        <mesh position={[-1.9, -1.75, -0.18]} rotation={[0.12, -0.16, -0.24]} scale={[2.1, 0.34, 1.12]}>
          <sphereGeometry args={[1, 36, 24]} />
          <meshStandardMaterial color="#202020" metalness={0.68} roughness={0.24} />
        </mesh>
        <mesh position={[-1.92, -1.59, -0.15]} rotation={[0.12, -0.16, -0.24]} scale={[1.82, 0.09, 0.9]}>
          <sphereGeometry args={[1, 36, 24]} />
          <meshStandardMaterial color="#c75c24" metalness={0.42} roughness={0.32} />
        </mesh>

        <HeroOrb palette={palette} position={[0.02, 0.66, 0.42]} size={0.72} />
        <HeroOrb palette={{ ...palette, primary: '#f3c28f' }} position={[1.72, -0.18, -0.06]} size={0.43} />

        <Float speed={1.35} rotationIntensity={0.52} floatIntensity={0.62}>
          <mesh position={[1.95, 1.2, 0.22]} rotation={[0.32, 0.48, 0.14]}>
            <octahedronGeometry args={[0.34, 0]} />
            <meshStandardMaterial color="#191919" metalness={0.82} roughness={0.2} />
          </mesh>
        </Float>
        <Float speed={1.2} rotationIntensity={0.72} floatIntensity={0.72}>
          <mesh position={[0.82, -1.32, 0.18]} rotation={[0.4, 0.15, -0.34]}>
            <torusKnotGeometry args={[0.38, 0.11, 72, 14]} />
            <meshStandardMaterial color="#252525" metalness={0.78} roughness={0.22} />
          </mesh>
        </Float>
        <mesh position={[-3.15, 1.15, -0.34]} scale={[0.66, 0.66, 0.66]}>
          <sphereGeometry args={[1, 28, 28]} />
          <meshStandardMaterial color="#f3c28f" metalness={0.12} roughness={0.34} />
        </mesh>
      </group>
    </>
  );
};

export const ThreeDHero: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`three-d-hero-visual ${className}`} aria-hidden="true">
    <Canvas
      camera={{ position: [0, 0, 8.8], fov: 36 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      fallback={null}
    >
      <HeroSceneContent />
    </Canvas>
    <div className="three-d-hero-visual__glow" />
  </div>
);
