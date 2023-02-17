import "./style.scss"
import ReactDOM from "react-dom/client"
import { Canvas } from "@react-three/fiber"
import Experience from "./Experience"
import * as THREE from "three"

const root = ReactDOM.createRoot(document.querySelector("#root"))

root.render(
  <>
    <Canvas
      shadows
      gl={{
        antialias: true,
        alpha: true,
      }}
      camera={{
        position: [0, 15, 15],
      }}
    >
      <Experience />
    </Canvas>
  </>
)
