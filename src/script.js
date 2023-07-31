import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particlesTexture = textureLoader.load('/textures/particles/2.png')

/* Particles */
const geometry = new THREE.BufferGeometry()
const count = 20000
const positionArr = new Float32Array(count * 3)
const colorsArr = new Float32Array(count * 3)
for (let i = 0; i < positionArr.length; i++) {
    positionArr[i] = (Math.random() - 0.5) * 10
    colorsArr[i] = Math.random()
}
const positionAttr = new THREE.BufferAttribute(positionArr, 3)
const colorsAttr = new THREE.BufferAttribute(colorsArr, 3)
geometry.setAttribute('position', positionAttr)
geometry.setAttribute('color', colorsAttr)

const material = new THREE.PointsMaterial({
    transparent: true,
    // alphaTest: 0.001,
    // depthTest: false,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    alphaMap: particlesTexture,
    size: 0.1,
    sizeAttenuation: true,
    vertexColors: true,
})

const particles = new THREE.Points(geometry, material)
scene.add(particles)

// Cube
// scene.add(
//     new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial())
// )

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    particles.rotation.y = elapsedTime * 0.2

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
