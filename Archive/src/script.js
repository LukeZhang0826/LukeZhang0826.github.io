import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import firefliesVertexShader from './shaders/fireflies/vertex.glsl'
import firefliesFragmentShader from './shaders/fireflies/fragment.glsl'
import gsap from 'gsap'
import { Vector3 } from 'three'

let isMobile = null;
window.addEventListener("load", () => {
    isMobile = navigator.userAgent.toLowerCase().match(/mobile/i);
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// Loading Manager
const loadingManager = new THREE.LoadingManager()

// loadingManager.onStart = function(url, item, total) {
//     console.log('Started loading')
// }
const progressBar = document.getElementById('progress-bar')

loadingManager.onProgress = function(url, loaded, total) {
    progressBar.value = (loaded / total) * 100
}

const progressBarContainer = document.querySelector('.progress-bar-container')
loadingManager.onLoad = function() {
    progressBarContainer.style.display = "none"
    var elements = document.getElementsByClassName('code-anim')
    for (let elem of elements) {
        elem.classList.add("animC")
    }
    var elements = document.getElementsByClassName('nav-anim')
    for (let elem of elements) {
        elem.classList.add("animN")
    }
}

// loadingManager.onError = function(url, item, total) {
//     console.log('Started loading')
// }


// GLTF loader
const gltfLoader = new GLTFLoader(loadingManager)
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Textures
 */
const WorkStationBake = textureLoader.load('WorkStationBake.jpg')
WorkStationBake.flipY = false
WorkStationBake.encoding = THREE.sRGBEncoding
const MusicStationBake = textureLoader.load('MusicStationBake.jpg')
MusicStationBake.flipY = false
MusicStationBake.encoding = THREE.sRGBEncoding
const HobbyStationBake = textureLoader.load('HobbyStationBake.jpg')
HobbyStationBake.flipY = false
HobbyStationBake.encoding = THREE.sRGBEncoding
const StructureAndDeco = textureLoader.load('StructureAndDeco.jpg')
StructureAndDeco.flipY = false
StructureAndDeco.encoding = THREE.sRGBEncoding
const DragonBake = textureLoader.load('DragonBake.jpg')
DragonBake.flipY = false
DragonBake.encoding = THREE.sRGBEncoding
const PortfolioImages = textureLoader.load('PortfolioImagesBake.jpg')
PortfolioImages.flipY = false
PortfolioImages.encoding = THREE.sRGBEncoding

/**
 * Materials
 */
// Baked material
const WorkStationBakeMaterial = new THREE.MeshBasicMaterial({ map: WorkStationBake })
const MusicStationBakeMaterial = new THREE.MeshBasicMaterial({ map: MusicStationBake })
const HobbyStationBakeMaterial = new THREE.MeshBasicMaterial({ map: HobbyStationBake })
const StructureAndDecoMaterial = new THREE.MeshBasicMaterial({ map: StructureAndDeco })
const DragonBakeMaterial = new THREE.MeshBasicMaterial({ map: DragonBake })
const PortfolioImagesMaterial = new THREE.MeshBasicMaterial({ map: PortfolioImages })

const gradient1Material = new THREE.MeshBasicMaterial({ color: 0x3DB3CE })
const gradient2Material = new THREE.MeshBasicMaterial({ color: 0x51ABAA })
const gradient3Material = new THREE.MeshBasicMaterial({ color: 0x78D968 })
const gradient4Material = new THREE.MeshBasicMaterial({ color: 0xE3F27C })
const gradient5Material = new THREE.MeshBasicMaterial({ color: 0xFFD460 })
const monitorMaterial = new THREE.MeshBasicMaterial({ color: 0x00080C })
/**
 *  Model
 */
gltfLoader.load(
    'PortfolioRoom.glb',
    (gltf) =>
    {
        const workStation = gltf.scene.children.find(child => child.name === 'WorkStation')
        const musicStation = gltf.scene.children.find(child => child.name === 'MusicStation')
        const hobbyStation = gltf.scene.children.find(child => child.name === 'HobbyStation')
        const structureAndDeco = gltf.scene.children.find(child => child.name === 'StructureAndDeco')
        const dragon = gltf.scene.children.find(child => child.name === 'GreenDino')

        const bigPlant = gltf.scene.children.find(child => child.name === 'PottedPlant')
        const smallPlant = gltf.scene.children.find(child => child.name === 'SmallPlant001')
        const speaker1 = gltf.scene.children.find(child => child.name === 'Speaker1001')
        const speaker2 = gltf.scene.children.find(child => child.name === 'Speaker2001')
        const speaker3 = gltf.scene.children.find(child => child.name === 'Speaker3001')
        const speaker4 = gltf.scene.children.find(child => child.name === 'Speaker4001')
        const mouse = gltf.scene.children.find(child => child.name === 'Mouse001')

        const posters = gltf.scene.children.find(child => child.name === 'Posters')
        const portraits = gltf.scene.children.find(child => child.name === 'Portraits')
        const gradient1 = gltf.scene.children.find(child => child.name === 'Gradient1')
        const gradient2 = gltf.scene.children.find(child => child.name === 'Gradient2')
        const gradient3 = gltf.scene.children.find(child => child.name === 'Gradient3')
        const gradient4 = gltf.scene.children.find(child => child.name === 'Gradient4')
        const gradient5 = gltf.scene.children.find(child => child.name === 'Gradient5')
        const monitor = gltf.scene.children.find(child => child.name === 'MonitorScreen')
        // Apply materials
        workStation.material = WorkStationBakeMaterial
        musicStation.material = MusicStationBakeMaterial
        hobbyStation.material = HobbyStationBakeMaterial
        structureAndDeco.material = StructureAndDecoMaterial
        dragon.material = DragonBakeMaterial

        bigPlant.material = HobbyStationBakeMaterial
        smallPlant.material = WorkStationBakeMaterial
        speaker1.material = WorkStationBakeMaterial
        speaker2.material = WorkStationBakeMaterial
        speaker3.material = WorkStationBakeMaterial
        speaker4.material = WorkStationBakeMaterial
        mouse.material = WorkStationBakeMaterial

        posters.material = PortfolioImagesMaterial
        portraits.material = PortfolioImagesMaterial
        gradient1.material = gradient1Material
        gradient2.material = gradient2Material
        gradient3.material = gradient3Material
        gradient4.material = gradient4Material
        gradient5.material = gradient5Material
        monitor.material = monitorMaterial

        scene.add(gltf.scene)
    }
)

/**
 * FireFlies
 */
// Geometry
const firefliesGeometry = new THREE.BufferGeometry()
const firefliesCount = 30
const positionArray = new Float32Array(firefliesCount * 3)
const scaleArray = new Float32Array(firefliesCount)

for (let i = 0; i < firefliesCount; i++)
{
    positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4
    positionArray[i * 3 + 1] = (Math.random()) * 2
    positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4
    scaleArray[i] = Math.random()
}

firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
firefliesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1))

// Material
const firefliesMaterial = new THREE.ShaderMaterial({ 
    uniforms: {
        uTime: {value: 0},
        uPixelRatio: {value: Math.min(window.devicePixelRatio, 2)},
        uSize: {value: 100}
    },
    vertexShader: firefliesVertexShader, 
    fragmentShader: firefliesFragmentShader,
    transparent: true,
    depthWrite: false,
    // blending: THREE.AdditiveBlending,
})

// Points
const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial)
scene.add(fireflies)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Update fireflies
    firefliesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.01, 100)

const cameraPositions = [
    {x: -0.85, y: 0.57, z: -0.49},
    {x: 0.0, y: 0.65, z: 0.2},
    {x: 0.0, y: 0.65, z: 0.2},
    {x: 0.0, y: 0.65, z: 0.2},
    {x: 1, y: 0.75, z: 0.45},
    {x: -0.42, y: 1.1, z: 0.2 },
    {x: 2, y: 1.2, z: 2},
    {x: 2, y: 1.2, z: 2}
]
const cameraLookAts = [
    {x: -0.87, y: 0.55, z: -0.49},
    {x: -0.87, y: 0.55, z: -0.49},
    {x: -0.87, y: 0.55, z: -0.49},
    {x: -0.87, y: 0.55, z: -0.49},
    {x: -0.73, y: 0.6, z: 0.45},
    {x: -0.42, y: 1.0, z: -0.98},
    {x: -0.87, y: 0.55, z: -0.49},
    {x: -0.87, y: 0.55, z: -0.49}
]
const parallaxMinMax = [
    {minX: null, maxX: null, minY: null, maxY: null},
    {minX: -0.3, maxX: 0.3, minY: -0.3, maxY: 0.3},
    {minX: -0.3, maxX: 0.3, minY: -0.3, maxY: 0.3},
    {minX: -0.3, maxX: 0.3, minY: -0.3, maxY: 0.3},
    {minX: -0.5, maxX: 0.5, minY: -0.3, maxY: 0.3},
    {minX: -0.5, maxX: 0.5, minY: -0.3, maxY: 0.3},
    {minX: -1, maxX: 1, minY: -0.5, maxY: 0.1},
    {minX: null, maxX: null, minY: null, maxY: null}
]

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setClearColor('#061519')

/**
 * Scroll
 */
let currentSection = Math.round(window.scrollY / sizes.height)

camera.position.set(cameraPositions[currentSection].x, cameraPositions[currentSection].y, cameraPositions[currentSection].z)
scene.add(camera)
// camera.lookAt(cameraLookAts[0].x, cameraLookAts[0].y, cameraLookAts[0].z)
const controls = new OrbitControls(camera, canvas)
controls.enabled = false
controls.enableDamping = true
controls.target = new Vector3(cameraLookAts[currentSection].x, cameraLookAts[currentSection].y, cameraLookAts[currentSection].z)

window.addEventListener('scroll', () => {
    const newSection = Math.round(window.scrollY / sizes.height)
    if(newSection != currentSection) {
        currentSection = newSection
        gsap.to(
            camera.position, {
                duration: 1.5,
                ease: 'power2.inOut',
                x: cameraPositions[currentSection].x,
                y: cameraPositions[currentSection].y,
                z: cameraPositions[currentSection].z,
            }
        )
        gsap.to(
            controls.target, {
                duration: 1.5,
                ease: 'power2.inOut',
                x: cameraLookAts[currentSection].x,
                y: cameraLookAts[currentSection].y,
                z: cameraLookAts[currentSection].z,
            }
        )
    }
})

/**
 * Cursor
 */
const cursor = { x: 0, y: 0}

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update materials
    firefliesMaterial.uniforms.uTime.value = elapsedTime
    
    // parallaxX motion
    if (currentSection >= 6) {
        controls.enabled = true
    } else {
        controls.enabled = false
    }

    if (!(isMobile)) {
        const parallaxX = cursor.x * deltaTime
        const parallaxY = cursor.y * deltaTime

        parallaxXSum += parallaxX
        parallaxYSum += parallaxY

        if (currentSection > 0 && currentSection < 7)
        {
            parallaxMovement(
                parallaxMinMax[currentSection].minX, 
                parallaxMinMax[currentSection].maxX, 
                parallaxMinMax[currentSection].minY, 
                parallaxMinMax[currentSection].maxY, 
                parallaxXSum, 
                parallaxYSum, 
                parallaxX, 
                parallaxY
            )
        }
    }
    
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()