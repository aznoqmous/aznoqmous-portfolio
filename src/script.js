import * as THREE from 'three'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'
import computerFragmentShader from './shaders/test/computer-fragment.glsl'
import computerVertexShader from './shaders/test/computer-vertex.glsl'
import Canvas from './canvas'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

const domLoaded = async ()=> new Promise(res => {
    document.addEventListener('DOMContentLoaded', ()=> res())
})

const main = async()=>{

await domLoaded()
window.scrollTo(0, 0)

// Loaders
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

// Canvas
const canvas = document.querySelector('canvas.webgl')

const loadImage = async(path)=>new Promise(res => {
    const image = new Image()
    if(image.naturalWidth) res(image)
    image.onload = ()=> res(image)
    image.src = path
})
const createTexture = async(path)=>{
    const logo = await loadImage(path)
    const customCanvas = new Canvas({
        width: logo.naturalWidth,
        height: logo.naturalHeight,
    })
    customCanvas.clear()
    customCanvas.ctx.drawImage(logo, 0, 0)
    return new THREE.CanvasTexture(customCanvas.c)
}

let currentTexture = await createTexture("./logo.png")
let nextTexture = await createTexture("./logo.png")

let ratio = 0
let preventScroll = false

const setImage = async(path)=>{
    currentTexture = nextTexture
    ratio = 0

    nextTexture = await createTexture(path)
}

const triggers = Array.from(document.querySelectorAll(".trigger"))
const containers = triggers.map(c => c.parentElement)
triggers.map(container => {
    const observer = new IntersectionObserver((entries)=>{
        for(let entry of entries){
            if(entry.isIntersecting) {
                const image = container.parentElement.querySelector('img')
                setImage(image.src)
                document.body.style.setProperty("--color", container.parentElement.dataset.color)
                window.scrollTo({
                    top: container.parentElement.getBoundingClientRect().top + window.scrollY,
                    behavior: "smooth"
                })
                preventScroll = true
            }
        }
    })
    observer.observe(container)
})
const nextButtons = Array.from(document.querySelectorAll(".next"))
nextButtons.map(button => {
    button.addEventListener('click', ()=>{
        const project = button.parentElement.parentElement
        const nextProject = project.parentElement.children[Array.from(project.parentElement.children).indexOf(project)+1]
        if(nextProject) window.scrollTo({
            top: nextProject.getBoundingClientRect().top + window.scrollY,
            behavior: "smooth"
        })
    })
})

const scene = new THREE.Scene()

const size = 256
const logoGeometry = new THREE.PlaneGeometry(315/250, 1, size, size)

const material = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    side: THREE.DoubleSide,
    // wireframe: true,
    uniforms: {
        uTime: { value: 0 },
        uScreenRatio: { value: 0 },
        uAmplitude: {value: 5},
        uHarmonies: {value: 5},
        uAttenuation: {value: 1},
        uCurrentTexture: new THREE.Uniform(),
        uNextTexture: new THREE.Uniform(),
        uRatio: {value: 0},
        uMousePosition: {value: new THREE.Vector2(0.56, 0.56)},
        uAberration: {value: 0 },
    }
})

const logoMesh = new THREE.Mesh(logoGeometry, material)
scene.add(logoMesh)

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

let activateScroll = null
const scrolled= ()=>{
    if(activateScroll) clearTimeout(activateScroll)
    activateScroll = setTimeout(()=> preventScroll = false, 100)
}
window.addEventListener('scroll', ()=>{
    material.uniforms.uAberration.value = Math.min(window.scrollY / window.innerHeight, 1)
    scrolled()
})
window.addEventListener('wheel', (e)=> {
    console.log(e)
    if(preventScroll) e.preventDefault()
}, {passive: false})

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
})

const cameraPosition = {x: 0, y: 0, z: 2}

window.addEventListener('mousemove', (e)=>{
    const movement = 2
    cameraPosition.x = -((e.clientX / window.innerWidth ) - 0.5)
    cameraPosition.y = (e.clientY / window.innerHeight ) - 0.5
    material.uniforms.uMousePosition.value.x = (e.clientX / window.innerWidth) * movement
    material.uniforms.uMousePosition.value.y = (1 - e.clientY / window.innerHeight) * movement
})

/* COMPUTER */
const gltf = await gltfLoader.loadAsync('./computer.glb')

const computerMaterial = new THREE.ShaderMaterial({
    fragmentShader: computerFragmentShader,
    vertexShader: computerVertexShader,
    side: THREE.DoubleSide,
    uniforms: {
        uTime: {value: 0},
        uAberration: {value: 0 },
        uRatio: {value: 0 },
    }
})

gltf.scene.children.map(mesh => mesh.material = computerMaterial)

const computerSize = 0.5
gltf.scene.scale.set(315 / 250 * computerSize, computerSize, computerSize)
gltf.scene.position.set(0, 0, 0.2)
scene.add(gltf.scene)
/* COMPUTER */

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 1)
scene.add(camera)

const light = new THREE.DirectionalLight(new THREE.Color("white"), 1)
light.position.set(4, 5, 2)
light.lookAt(0,0,0)
scene.add(light)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new THREE.Clock()
let delta = 0
let lastTime = 0

const tick = () =>
{
    const time = clock.getElapsedTime()
    material.uniforms.uTime.value = time
    material.uniforms.uCurrentTexture.value = currentTexture
    material.uniforms.uNextTexture.value = nextTexture
    ratio += delta
    ratio = Math.min(1, ratio);
    material.uniforms.uRatio.value = ratio
    material.uniforms.uScreenRatio.value = sizes.height / sizes.width
    
    computerMaterial.uniforms.uTime.value = time
    computerMaterial.uniforms.uRatio.value = ratio
    computerMaterial.uniforms.uAberration.value = material.uniforms.uAberration.value

    renderer.render(scene, camera)
    
    delta = (performance.now() - lastTime) / 1000
    lastTime = performance.now()
    
    requestAnimationFrame(tick)
    
    camera.position.set(
        cameraPosition.x + Math.sin(time) * 0.1, 
        cameraPosition.y + Math.sin(time) * 0.1, 
        2.5 - (1 - material.uniforms.uAberration.value) * 1.5
    )

    camera.lookAt(new THREE.Vector3(-1 * material.uniforms.uAberration.value, 0, 0))

}

tick()

}

main()