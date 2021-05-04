import React from 'react'
import * as THREE from 'three'
const OrbitControls = require('three-orbit-controls')(THREE)

const textureArray = [
  'https://s3-us-west-2.amazonaws.com/s.cdpn.io/259155/THREE_gates.jpg',
  'https://s3-us-west-2.amazonaws.com/s.cdpn.io/259155/THREE_crate1.jpg',
  'https://s3-us-west-2.amazonaws.com/s.cdpn.io/259155/THREE_crate2.jpg',
]

const Canvas = React.memo(
  () => {
    const ref = React.useRef(null)

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial()

    // instantiate a texture loader
    const loader = new THREE.TextureLoader()

    const cube = new THREE.Mesh(geometry, material)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xcccccc)

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.domElement.id = 'canvas' // set ID on 3D canvas

    //allow cross origin loading
    loader.crossOrigin = ''

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.update()

    React.useEffect(() => {
      if (ref.current) {
        // @ts-ignore
        ref.current.appendChild(renderer.domElement)

        const animate = () => {
          requestAnimationFrame(animate)
          renderer.render(scene, camera)
        }
        animate()
      }
    }, [])

    return (
      <>
        <div id="threed" ref={ref} />
        <ChangeTexture
          loader={loader}
          material={material}
          scene={scene}
          cube={cube}
        />
      </>
    )
  },
  // Only render once. We never want to rerender this part!
  () => true
)

const buttonStyle = {
  position: 'absolute',
  top: 50,
  left: 50,
  backgroundColor: 'purple',
  padding: 16,
  border: 'none',
  color: 'white',
  borderRadius: 5,
} as any

const ChangeTexture = ({ loader, material, scene, cube }: any) => {
  const { texture, setTexture } = React.useContext(GlobalStateContext)

  const update = React.useCallback(() => {
    if (texture > textureArray.length - 1) {
      setTexture(0)
    } else {
      setTexture(texture + 1)
    }
  }, [texture])

  React.useEffect(() => {
    // @ts-ignore
    loader.load(textureArray[texture], function (tex: any) {
      // Once the texture has loaded assign it to the material
      material.map = tex

      // Add the mesh into the scene
      scene.add(cube)
    })
  }, [texture])

  return (
    <button id="cube-btn" style={buttonStyle} onClick={update}>
      Change texture {texture}
    </button>
  )
}

const GlobalStateContext = React.createContext({
  texture: 0,
  setTexture: (texture: number) => {},
})

function App() {
  const [texture, setTexture] = React.useState(0)

  const update = React.useCallback((updatedTexture) => {
    setTexture(updatedTexture)
    notifyOthers(updatedTexture)
  }, [])

  const defaultValue = { texture, setTexture: update }

  const notifyOthers = React.useCallback((updatedTexture) => {
    // Notify others...
    console.log('updatedTexture', updatedTexture)
  }, [])

  return (
    <GlobalStateContext.Provider value={defaultValue}>
      <Canvas />
    </GlobalStateContext.Provider>
  )
}

export default App
