import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { SphereGeometry, TextureLoader } from 'three'
import CANNON from 'cannon'
import $ from "./Jquery"
$(".close").css("display","none")

const textureLoader = new THREE.TextureLoader()

var audio = new Audio('/musicbox.wav');
var audiobounce = new Audio('/bounce.wav');

const playHitSound = (collision) =>
{
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()

    if(impactStrength > 2)
    {
        audiobounce.volume = Math.random()*.2
        audiobounce.currentTime = 0
        audiobounce.play()
    }
}


//material patterns
const medstarTexture = textureLoader.load('/MedStar.png')
const hallmarkTexture = textureLoader.load('/hallmark.jpg')
medstarTexture.wrapT = THREE.MirroredRepeatWrapping
medstarTexture.wrapS = THREE.MirroredRepeatWrapping
const medstarMaterial = new THREE.MeshBasicMaterial({map:medstarTexture})
medstarTexture.repeat.set(2,2)

hallmarkTexture.wrapT = THREE.MirroredRepeatWrapping
hallmarkTexture.wrapS = THREE.MirroredRepeatWrapping
const hallmarkMaterial = new THREE.MeshBasicMaterial({map:whallmarkTexture})
hallmarkTexture.repeat.set(2,2)



//open button

const openButton=document.getElementsByClassName("open");
const closeButton = document.getElementsByClassName("close")
const moreButton = document.getElementsByClassName("more")

//raycaster
const raycaster = new THREE.Raycaster()

//cannon
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
world.gravity.set(0, - 9.82, 0)

const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.8,
        restitution: 0.1
    }
)

    
//physics floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1,0,0),
    Math.PI *0.5
)
//objects to update
const objectsToUpdate = []

//createbox

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial1 = new THREE.MeshStandardMaterial({
   map:wrapperTexture1
})
const boxMaterial2 = new THREE.MeshStandardMaterial({
    map:wrapperTexture2
 })
 const boxMaterial3 = new THREE.MeshStandardMaterial({
    map:wrapperTexture3
 })
 const boxMaterial4 = new THREE.MeshStandardMaterial({
    map:wrapperTexture4
 })

const createBox = (width, height, depth, position,rand) =>
{
    // Three.js mesh
    const mesh = new THREE.Mesh()
    switch(rand){
        case 1:
            mesh.material = boxMaterial1
        break;
        case 2:
            mesh.material = boxMaterial2
        break;
        case 3:
            mesh.material = boxMaterial3
        break;
        case 4:
            mesh.material = boxMaterial4
        break;
    }
    
    
    mesh.geometry=boxGeometry
    mesh.scale.set(width, height, depth)
    mesh.castShadow = true
    mesh.position.copy(position)
    mesh.geometry.computeBoundingBox();
    var max = mesh.geometry.boundingBox.max;
    var min = mesh.geometry.boundingBox.min;
    var height = max.y - min.y;
    var width = max.x - min.x;
    wrapperTexture3.repeat.set(width / 1 , height / 1);
    wrapperTexture3.needsUpdate = true;
    scene.add(mesh)

    // Cannon.js body
    const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))

    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 10, 0),
        shape: shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    body.addEventListener('collide', playHitSound)

    world.addBody(body)

    // Save in objects
    objectsToUpdate.push({ mesh, body })
}

// createBox(1, 1.5, 2, { x: 0, y: 3, z: 0 })




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

})





const mouse = new THREE.Vector2()
mouse.x = null
mouse.y=null

window.addEventListener('mousemove', (event) =>
{
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1

    // console.log(mouse)
})
/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()




const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
 WrapperMaterial1
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
floor.position.y = -.5
scene.add(floor)

const clock = new THREE.Clock()
let oldElapsedTime = 0

floorBody.position.y = -.05
floorBody.addShape(floorShape)
floorBody.material=defaultMaterial
world.addBody(floorBody)
world.addContactMaterial(defaultContactMaterial)


/**
 * Models
 */
// const dracoLoader = new DRACOLoader()
// dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
// gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null
let action = null
let actionRev = null
let box = null
let tree = null
let carBoxParent
let planeBoxParent
let carBox 
let planeBox



gltfLoader.load(

            '/models/ambulancebox.glb',
            (gltf) =>
            {   
                carBoxParent= fltf
                carBox = gltf.scene
                carBox.traverse((child) =>
                {
                    if(child.name ==  "cube"||child.name ==  "cube1"||
                    child.name ==  "cube2"||child.name ==  "cube3"||
                    child.name ==  "cube4"||child.name ==  "cube5"){
                    child.material = medstarMaterial
                    }
                })
                
                carBox.scale.set(0.25, 0.25, 0.25)
                scene.add(carBox)
      
            }
        )


        gltfLoader.load(

            '/models/jetbox.glb',
            (gltf) =>
            {   
                planeBoxParent= fltf
                planeBox = gltf.scene
                planeBox.traverse((child) =>
                {
                    if(child.name ==  "cube"||child.name ==  "cube1"||
                    child.name ==  "cube2"||child.name ==  "cube3"||
                    child.name ==  "cube4"||child.name ==  "cube5"){
                    child.material = medstarMaterial
                    }
                })
                
                planeBox.scale.set(0.25, 0.25, 0.25)
                scene.add(planeBox)
      
            }
        )
        

    


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('white', .5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('orange', 2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(- 5, 5, 0)
scene.add(directionalLight)




/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setClearColor( 'orange',.5);

// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

raycaster.setFromCamera(mouse, camera)


//     for (var i = 0; i < openButton.length; i++) {
//         openButton[i].addEventListener('click',(event) =>
//     {       
//         $(".open").css("display","none")
//         $(".close").css("display","block")
//         audio.play()
//         action.reset()
//         action.weight=1
//         actionRev.weight=0
//           action.setEffectiveWeight(1)
//         action.clampWhenFinished = true
//         action.timeScale=3
//         action.setLoop( THREE.LoopOnce )

//         action.play()
//         floor.position.copy(floorBody.position)
//       })
// }

for (var i = 0; i < closeButton.length; i++) {
    closeButton[i].addEventListener('click',(event) =>
{      
   
    $(".close").css("display","none")
    $(".open").css("display","block")
    audio.pause()
    actionRev.reset()
    actionRev.weight=1
    action.weight=0
    actionRev.setEffectiveWeight(1)
    actionRev.timeScale=3
    actionRev.clampWhenFinished = true
    actionRev.setLoop( THREE.LoopOnce )
    actionRev.stopFading ()
    actionRev.play()
  
})
}

for (var i = 0; i < moreButton.length; i++) {
    moreButton[i].addEventListener('click',(event) =>
{ 

    createBox(
        Math.random()*.4+.2,
        Math.random()*.4+.2,
        Math.random()*.4+.2,
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
        },
       Math.floor( Math.random()*4)+1
    )
})
}

/**
 * Animate
 */


// const clock = new THREE.Clock()
let previousTime = 0
const tick = () =>
{
    for(const object of objectsToUpdate)
    {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
    }
    
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    world.step(1 / 60, deltaTime, 3)


    floor.position.copy( floorBody.position)
    floor.quaternion.copy(floorBody.quaternion)



    if(tree != null){
    tree.children[0].rotation.y += 0.01}

  

    if(mixer)
    {
        mixer.update(deltaTime)
    }

    controls.update()



    
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()