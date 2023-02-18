import {
  MeshReflectorMaterial,
  Text,
  Html,
  OrbitControls,
  PivotControls,
  TransformControls,
  Float,
  SoftShadows,
  Sky,
  useGLTF,
  Clone,
} from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useEffect, useRef, useMemo } from "react"
import * as THREE from "three"
import { gsap } from "gsap"
import {
  BallCollider,
  CuboidCollider,
  Debug,
  InstancedRigidBodies,
  Physics,
  RigidBody,
} from "@react-three/rapier"

export default function Experience() {
  const claw = useGLTF("./glb/CraneClaw.glb")

  const ground1 = useRef()
  const ground2 = useRef()
  const claw1 = useRef()
  const claw2 = useRef()
  const claw3 = useRef()
  const clawBody = useRef()
  const peanut = useRef()
  const prize1 = useRef()
  const prize2 = useRef()
  const prize3 = useRef()

  const peanutCount = 300

  const peanutTransforms = useMemo(() => {
    const positions = []
    const rotations = []
    const scales = []

    for (let i = 0; i < peanutCount; i++) {
      positions.push([
        (Math.random() - 0.5) * 18,
        Math.random() * 4,
        (Math.random() - 0.5) * 14 - 4,
      ])
      rotations.push([0, 0, 0])
      scales.push([1, 1, 1])
    }

    return { positions, rotations, scales }
  }, [])

  const clawsArray = [claw1, claw2, claw3]
  let clawTimes = {
    down: 2,
    close: 0,
    up: 2,
  }
  let isClawClosed = false
  let clawRotationStart = 0
  let clawRotationDirection = -1
  let isClawAnimating = false
  let clawAnimatingDelay = 0
  const clawPosition = {
    x: 0,
    y: 0,
  }
  const maxTranslation = 6.75

  const closeCrane = () => {
    if (isClawAnimating == false) {
      isClawAnimating = true
      isClawClosed = !isClawClosed
      clawTimes.down = 2
      clawTimes.close = 0
      clawTimes.up = 2
      if (isClawClosed == true) {
        clawRotationStart = 0
        clawRotationDirection = -1
        gsap.to(clawTimes, { duration: 1, down: 10, ease: "none" })
        gsap.to(clawTimes, { duration: 1, delay: 1.1, close: 1, ease: "none" })
        gsap.to(clawTimes, { duration: 1, delay: 2.2, up: 10, ease: "none" })
        clawAnimatingDelay = 3300
      } else {
        clawRotationStart = -Math.PI / 2
        clawRotationDirection = 1
        gsap.to(clawTimes, { duration: 1, close: 1, ease: "none" })
        clawAnimatingDelay = 1100
      }

      setTimeout(() => {
        isClawAnimating = false
      }, clawAnimatingDelay)
    }
  }

  let time = 0
  useFrame((state, delta) => {
    time = state.clock.elapsedTime

    if (isClawAnimating == false) {
      for (let i = 0; i < clawsArray.length; i++) {
        clawsArray[i].current.setNextKinematicTranslation({
          x:
            Math.cos(((Math.PI * 4) / 3) * (i + 1)) +
            state.pointer.x * maxTranslation -
            0.6,
          y: 10,
          z:
            -Math.sin(((Math.PI * 4) / 3) * (i + 1)) +
            -state.pointer.y * maxTranslation,
        })
      }
      clawBody.current.setNextKinematicTranslation({
        x: state.pointer.x * maxTranslation - 0.5,
        y: 10,
        z: -state.pointer.y * maxTranslation,
      })
    }
    if (clawTimes.down > 2 && clawTimes.down < 10) {
      for (let i = 0; i < clawsArray.length; i++) {
        clawsArray[i].current.setNextKinematicTranslation({
          x:
            Math.cos(((Math.PI * 4) / 3) * (i + 1)) +
            state.pointer.x * maxTranslation -
            0.6,
          y: 12 - clawTimes.down,
          z:
            -Math.sin(((Math.PI * 4) / 3) * (i + 1)) +
            -state.pointer.y * maxTranslation,
        })
      }
      clawBody.current.setNextKinematicTranslation({
        x: state.pointer.x * maxTranslation - 0.5,
        y: 12 - clawTimes.down,
        z: -state.pointer.y * maxTranslation,
      })
    }
    if (clawTimes.close > 0 && clawTimes.close < 1) {
      for (let i = 0; i < clawsArray.length; i++) {
        const euRotation = new THREE.Euler(
          0,
          ((Math.PI * 4) / 3) * (i + 1),
          clawRotationStart +
            ((clawTimes.close * Math.PI) / 2) * clawRotationDirection
        )
        const quRotation = new THREE.Quaternion().setFromEuler(euRotation)
        clawsArray[i].current.setNextKinematicRotation(quRotation)

        clawsArray[i].current.setNextKinematicTranslation({
          x:
            Math.cos(((Math.PI * 4) / 3) * (i + 1)) +
            state.pointer.x * maxTranslation -
            0.6,
          y: 12 - clawTimes.down,
          z:
            -Math.sin(((Math.PI * 4) / 3) * (i + 1)) +
            -state.pointer.y * maxTranslation,
        })
      }
      clawBody.current.setNextKinematicTranslation({
        x: state.pointer.x * maxTranslation - 0.5,
        y: 12 - clawTimes.down,
        z: -state.pointer.y * maxTranslation,
      })
    }
    if (clawTimes.up > 2 && clawTimes.up < 10) {
      for (let i = 0; i < clawsArray.length; i++) {
        clawsArray[i].current.setNextKinematicTranslation({
          x:
            Math.cos(((Math.PI * 4) / 3) * (i + 1)) +
            state.pointer.x * maxTranslation -
            0.6,
          y: clawTimes.up,
          z:
            -Math.sin(((Math.PI * 4) / 3) * (i + 1)) +
            -state.pointer.y * maxTranslation,
        })
      }
      clawBody.current.setNextKinematicTranslation({
        x: state.pointer.x * maxTranslation - 0.5,
        y: clawTimes.up,
        z: -state.pointer.y * maxTranslation,
      })
    }
  })

  return (
    <>
      {/* <OrbitControls makeDefault /> */}

      <pointLight
        position={[0, 30, 10]}
        intensity={0.4}
        castShadow
        shadow-mapSize={[2048 * 0.5, 2048 * 0.5]}
      />
      <ambientLight intensity={0.5} color="#fafafa" />
      <Sky onClick={closeCrane} />

      <Physics>
        {/* <Debug /> */}

        {/* Claw */}

        <RigidBody
          ref={clawBody}
          type="kinematicPosition"
          colliders="hull"
          position-y={10}
        >
          <mesh castShadow>
            <cylinderGeometry args={[1.1, 1.1, 0.25]} />
            <meshStandardMaterial />
          </mesh>
        </RigidBody>

        <group rotation-y={((Math.PI * 4) / 3) * 1}>
          <RigidBody
            ref={claw1}
            colliders="trimesh"
            position={[1, 10, 0]}
            restitution={0}
            type="kinematicPosition"
          >
            <Clone
              object={claw.scene}
              scale={0.01}
              rotation-z={Math.PI / 2}
              castShadow
            />
          </RigidBody>
        </group>

        <group rotation-y={((Math.PI * 4) / 3) * 2}>
          <RigidBody
            ref={claw2}
            colliders="trimesh"
            position={[1, 10, 0]}
            restitution={0}
            type="kinematicPosition"
          >
            <Clone
              object={claw.scene}
              scale={0.01}
              rotation-z={Math.PI / 2}
              castShadow
            />
          </RigidBody>
        </group>

        <group rotation-y={((Math.PI * 4) / 3) * 3}>
          <RigidBody
            ref={claw3}
            colliders="trimesh"
            position={[1, 10, 0]}
            restitution={0}
            type="kinematicPosition"
          >
            <Clone
              object={claw.scene}
              scale={0.01}
              rotation-z={Math.PI / 2}
              castShadow
            />
          </RigidBody>
        </group>

        {/* Prizes */}
        <RigidBody
          ref={prize1}
          restitution={0}
          position={[
            (Math.random() - 0.5) * 15,
            8,
            (Math.random() - 0.5) * 10 - 5,
          ]}
          mass={5}
        >
          <mesh castShadow scale={2.25}>
            <boxGeometry />
            <meshStandardMaterial color="mediumPurple" />
          </mesh>
        </RigidBody>

        <RigidBody
          ref={prize2}
          restitution={0}
          position={[
            (Math.random() - 0.5) * 15,
            8,
            (Math.random() - 0.5) * 10 - 5,
          ]}
          mass={5}
          colliders="hull"
        >
          <mesh castShadow scale={1}>
            <torusKnotGeometry />
            <meshStandardMaterial color="mediumPurple" />
          </mesh>
        </RigidBody>

        <RigidBody
          ref={prize3}
          restitution={0}
          position={[
            (Math.random() - 0.5) * 15,
            8,
            (Math.random() - 0.5) * 10 - 5,
          ]}
          mass={5}
          colliders="hull"
        >
          <mesh castShadow scale={2.25}>
            <tetrahedronGeometry />
            <meshStandardMaterial color="mediumPurple" />
          </mesh>
        </RigidBody>

        <RigidBody
          //   ref={prize3}
          restitution={0}
          position={[
            (Math.random() - 0.5) * 15,
            8,
            (Math.random() - 0.5) * 10 - 5,
          ]}
          mass={5}
          colliders="ball"
        >
          <mesh castShadow scale={1.35}>
            <sphereGeometry />
            <meshStandardMaterial color="mediumPurple" />
          </mesh>
        </RigidBody>

        <RigidBody
          //   ref={prize3}
          restitution={0}
          position={[
            (Math.random() - 0.5) * 15,
            8,
            (Math.random() - 0.5) * 10 - 5,
          ]}
          mass={5}
          colliders="hull"
        >
          <mesh castShadow scale={1.4}>
            <cylinderGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="mediumPurple" />
          </mesh>
        </RigidBody>

        <RigidBody
          //   ref={prize3}
          restitution={0}
          position={[
            (Math.random() - 0.5) * 15,
            8,
            (Math.random() - 0.5) * 10 - 5,
          ]}
          mass={5}
          colliders="hull"
        >
          <mesh castShadow scale={1.25}>
            <torusGeometry args={[1, 0.5, 32]} />
            <meshStandardMaterial color="mediumPurple" />
          </mesh>
        </RigidBody>

        {/* Instanced Objects */}

        <InstancedRigidBodies
          colliders="ball"
          restitution={0}
          positions={peanutTransforms.positions}
          rotations={peanutTransforms.rotations}
          scales={peanutTransforms.scales}
        >
          <instancedMesh
            ref={peanut}
            args={[null, null, peanutCount]}
            castShadow
          >
            <sphereGeometry args={[0.7]} />
            <meshStandardMaterial color="tomato" />
          </instancedMesh>
        </InstancedRigidBodies>

        {/* Fixed */}

        <RigidBody type="fixed" restitution={0}>
          <mesh
            position={[-7.5, 0, 4.75]}
            rotation-x={-Math.PI / 2}
            receiveShadow
          >
            <boxGeometry args={[5, 0.5, 3]} />
            <meshStandardMaterial color="greenyellow" side={THREE.DoubleSide} />
          </mesh>
        </RigidBody>

        <RigidBody type="fixed" restitution={0}>
          <mesh
            position={[-4.75, 0, 7.25]}
            rotation-x={-Math.PI / 2}
            receiveShadow
          >
            <boxGeometry args={[0.5, 5.5, 3]} />
            <meshStandardMaterial color="greenyellow" side={THREE.DoubleSide} />
          </mesh>
        </RigidBody>

        <RigidBody type="fixed" restitution={0}>
          <mesh
            ref={ground2}
            position={[-7.5, -4, -2.5]}
            rotation-x={-Math.PI / 2}
            receiveShadow
          >
            <boxGeometry args={[5, 15, 5]} />
            <meshStandardMaterial color="greenyellow" side={THREE.DoubleSide} />
          </mesh>
        </RigidBody>

        <RigidBody type="fixed" restitution={0}>
          <mesh
            ref={ground1}
            position-x={2.5}
            position-y={-4}
            rotation-x={-Math.PI / 2}
            receiveShadow
          >
            <boxGeometry args={[15, 20, 5]} />
            <meshStandardMaterial color="greenyellow" side={THREE.DoubleSide} />
          </mesh>
        </RigidBody>

        <RigidBody type="fixed" restitution={0} position={[0, 6, -10.5]}>
          <mesh receiveShadow>
            <boxGeometry args={[20, 25, 1]} />
            <meshStandardMaterial color="greenyellow" />
          </mesh>
        </RigidBody>

        <RigidBody type="fixed" restitution={0} position={[0, 6, 10.5]}>
          <CuboidCollider args={[11, 12.5, 1]} />
        </RigidBody>

        <RigidBody
          type="fixed"
          restitution={0}
          position={[-10.5, 6, 0]}
          rotation-y={Math.PI / 2}
        >
          <mesh receiveShadow>
            <boxGeometry args={[20, 25, 1]} />
            <meshStandardMaterial color="greenyellow" />
          </mesh>
        </RigidBody>

        <RigidBody
          type="fixed"
          restitution={0}
          position={[10.5, 6, 0]}
          rotation-y={Math.PI / 2}
        >
          <mesh receiveShadow>
            <boxGeometry args={[20, 25, 1]} />
            <meshStandardMaterial color="greenyellow" />
          </mesh>
        </RigidBody>
      </Physics>
    </>
  )
}
