import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { AnimationActionLoopStyles, SphereGeometry, TextureLoader } from 'three'
import gsap from "gsap"
import CANNON from 'cannon'
import $ from "./Jquery"
$(".close").css("display","none")
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils';

const textureLoader = new THREE.TextureLoader()

var audio = new Audio('/musicbox.wav');
var audiobounce = new Audio('/bounce.wav');
var ahahah = new Audio('/magicword.mp3');


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
medstarTexture.wrapT = THREE.RepeatWrapping
medstarTexture.wrapS = THREE.RepeatWrapping
const medstarMaterial = new THREE.MeshStandardMaterial({map:medstarTexture})
medstarTexture.repeat.set(-5,15)

hallmarkTexture.wrapT = THREE.RepeatWrapping
hallmarkTexture.wrapS = THREE.RepeatWrapping
const hallmarkMaterial = new THREE.MeshStandardMaterial({map:hallmarkTexture})
hallmarkTexture.repeat.set(-5,15)



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


    const createRandomBox = (width, height, depth, position,rand) =>
{

    if(boxBody!=null){
        world.removeBody(boxBody)
        scene.remove(boxGroup)
        world.removeBody(boxBody2)
        world.removeBody(boxChild)
        scene.remove(boxGroup2)
        }
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
        position: new CANNON.Vec3(0, 100, 0),
        shape: shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    body.addEventListener('collide', playHitSound)

    world.addBody(body)

    // Save in objects
    objectsToUpdate.push({ mesh, body })
    randomBoxes.push({mesh, body})

}






//createbox
//material patterns

const wrapperTexture1 = textureLoader.load('/models/tree/checker1.jpg')
wrapperTexture1.repeat.set(2,2)
wrapperTexture1.wrapT = THREE.MirroredRepeatWrapping
wrapperTexture1.wrapS = THREE.MirroredRepeatWrapping

const WrapperMaterial1 = new THREE.MeshBasicMaterial({map:wrapperTexture1})
const wrapperTexture2 = textureLoader.load('/models/tree/checker2.jpg')
const WrapperMaterial2 = new THREE.MeshBasicMaterial({map:wrapperTexture2})
const wrapperTexture3 = textureLoader.load('/models/tree/dots2a.jpg')
const WrapperMaterial3 = new THREE.MeshBasicMaterial({map:wrapperTexture3})
const wrapperTexture4 = textureLoader.load('/models/tree/dots3a.jpg')
const WrapperMaterial4 = new THREE.MeshBasicMaterial({map:wrapperTexture4})
wrapperTexture3.repeat.set(5,5)
wrapperTexture3.wrapT = THREE.RepeatWrapping
wrapperTexture3.wrapS = THREE.RepeatWrapping
wrapperTexture4.wrapT = THREE.RepeatWrapping
wrapperTexture4.wrapS = THREE.RepeatWrapping
wrapperTexture2.wrapT = THREE.RepeatWrapping
wrapperTexture2.wrapS = THREE.RepeatWrapping

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

const createBox = (input) =>
{   
    if(randomBoxes.length>0){
        console.log("removing the randoms")
        randomBoxes.forEach(element => {
            world.removeBody(element.body)
            scene.remove(element.mesh)
            
        });
    }
    // objectsToUpdate.pop()
    // objectsToUpdate.pop()

    rotate = "off"
   

    if(boxBody!=null){
    world.removeBody(boxBody)
    scene.remove(boxGroup)
    world.removeBody(boxBody2)
    world.removeBody(boxChild)
    scene.remove(boxGroup2)
    }
    let boxMesh
    let openAnimation
    planeCarGroup = new THREE.Group();
    planeCarGroup.scale.set(.25,.25,.25)

    switch(input){
    case "hallmark":
        document.querySelector(".mainSlide").classList.add("hidden")
        document.querySelector(".M-menu").classList.add("hidden")
        document.querySelector(".H-menu").classList.remove("hidden")



        boxMesh = SkeletonUtils.clone(planeBox)
        mixer = new THREE.AnimationMixer(boxMesh)
        openAnimation = mixer.clipAction(planeBoxParent.animations[1])
        plane = boxMesh.children[1]
        
        plane.position.x =0
        plane.position.z =-2
        plane.rotateX( Math.PI*1.25)
       
        planeCarGroup.add(plane)
     


      
        break;
    case "medstar":
        document.querySelector(".mainSlide").classList.add("hidden")
        document.querySelector(".H-menu").classList.add("hidden")
        document.querySelector(".M-menu").classList.remove("hidden")
        boxMesh = SkeletonUtils.clone(carBox)
         mixer = new THREE.AnimationMixer(boxMesh)
        openAnimation = mixer.clipAction(carBoxParent.animations[1]) 
        car = boxMesh.children[1]
        car.rotateY( Math.PI*1.25)
        planeCarGroup.add(car)
  

    
    }
   
    openAnimation.clampWhenFinished = true
    boxGroup = new THREE.Group()
    planeCarGroup.position.y-=.98
    boxGroup.add(planeCarGroup)
    boxMesh.position.y -=.98
    boxMesh.rotateY( Math.PI*1.25)
    boxGroup.add(boxMesh)
    
    openAnimation.setLoop( THREE.LoopOnce )
    setTimeout(() => {

        openAnimation.play()
        setTimeout(() => {
            if(plane!=null && input =="hallmark"){
                gsap.to( plane.position,{duration:.5,y:6})
                gsap.to( plane.position,{duration:1,z:-20})
                gsap.to( plane.rotation,{duration:1,y:plane.rotation.y-Math.PI*.75})
                rotate="on"
                setTimeout(() => {

                    boxChild=airport.clone()
                    boxChild.position.y =-1.8
                    boxChild.position.x +=1.8
                    boxChild.position.z +=1.8
                    boxChild.scale.y *=.7
                    boxChild.scale.x *=.7
                    boxChild.scale.z *=.7
                    
                    boxChild.rotation.y =Math.PI

                    boxGroup2= new THREE.Group()
                    boxGroup2.add(boxChild)
                    boxGroup2.position.y =  10
                    scene.add(boxGroup2)

                    const shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1))

                    boxBody2 = new CANNON.Body({
                    mass: 1,
                    position: new CANNON.Vec3(0, 10, 0),
                    shape: shape,
                    material: defaultMaterial
                })
                boxBody2.position=new CANNON.Vec3(0, 10, 0)
                boxBody2.addEventListener('collide', playHitSound)
            
                world.addBody(boxBody2)
                objectsToUpdate.push({ boxGroup2, boxBody2 })



                    
                }, 1000);

                // planeStart = true;
                }

        if(car!=null && input =="medstar"){
            
            gsap.to( car.position,{duration:1,z:-20})
            gsap.to( car.position,{duration:1,x:-20})
            gsap.to( car.rotation,{duration:1,y:car.rotation.y-Math.PI*.5})


            setTimeout(() => {

                boxChild=hospital.clone()
                boxChild.position.y =-2
                // boxChild.position.x +=1.8
                // boxChild.position.z +=1.8
               
                
                boxChild.rotation.y =Math.PI

                boxGroup2= new THREE.Group()
                boxGroup2.add(boxChild)
                boxGroup2.position.y =  10
                scene.add(boxGroup2)

                const shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1))

                boxBody2 = new CANNON.Body({
                mass: 1,
                position: new CANNON.Vec3(0, 10, 0),
                shape: shape,
                material: defaultMaterial
            })
            boxBody2.position=new CANNON.Vec3(0, 10, 0)
            boxBody2.addEventListener('collide', playHitSound)
        
            world.addBody(boxBody2)
            objectsToUpdate.push({ boxGroup2, boxBody2 })



                
            }, 1000);


            // planeStart = true;
            }
            rotate="on"

       
        
    }, 1500);
       
        
    }, 2000);
 
    boxGroup.position.y = 10;

    scene.add(boxGroup)

    // Cannon.js body
    const shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1))

        boxBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 10, 0),
        shape: shape,
        material: defaultMaterial
    })
    boxBody.position=new CANNON.Vec3(0, 10, 0)
    boxBody.addEventListener('collide', playHitSound)

    world.addBody(boxBody)

    // Save in objects
    objectsToUpdate.push({ boxGroup, boxBody })
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
    new THREE.PlaneGeometry(100, 100),
 new THREE.MeshStandardMaterial({color:"gray"})
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)



floorBody.position.y = -0.5
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

let currentSlide
let mixer = null
let carBoxParent
let planeBoxParent
let carBox 
let planeBox
let boxBody
let boxGroup
let plane
let car
let planeCarGroup
let rotate = "off"
let buildings
let hospital
let airport
let boxChild
let boxGroup2
let boxBody2
const randomBoxes = []

var links = document.querySelectorAll("a")
links.forEach(element => {

    element.addEventListener("click", (e)=>{
        e.stopPropagation();
        e.preventDefault();
        let number = e.target.getAttribute("data")
        document.querySelector(".mainSlide").classList.remove("hidden")
        let pages = document.querySelectorAll(".page")
        pages.forEach(element => {
            element.classList.add("hidden")
            if(element.getAttribute("data")==number){
                element.classList.remove("hidden")
            }
        currentSlide = number
        });
    
    
    });
    
});

document.querySelector(".xOut").addEventListener("click", ()=>{

    document.querySelector(".mainSlide").classList.add("hidden")

})

document.querySelector(".nextOut").addEventListener("click", ()=>{
    currentSlide++;
    if(currentSlide>6){
        currentSlide= 1
    }
    var pages = document.querySelectorAll(".page")
pages.forEach(element => {

    

    element.classList.add("hidden")
    if (element.getAttribute("data")==currentSlide){
        element.classList.remove("hidden");
    }


})

})

document.querySelector(".prevOut").addEventListener("click", ()=>{
    currentSlide--;
    if(currentSlide<1){
        currentSlide= 6
    }
    var pages = document.querySelectorAll(".page")
pages.forEach(element => {

    

    element.classList.add("hidden")
    if (element.getAttribute("data")==currentSlide){
        element.classList.remove("hidden");
    }


})

})




gltfLoader.load(

            '/models/ambulancebox.glb',
            (gltf) =>
            {   console.log(gltf.scene)
                carBoxParent= gltf
                carBox = gltf.scene
                carBox.traverse((child) =>
                {
                    
                   if(child.name == "Cube"||child.name =="Cube1"||
                   child.name == "Cube2"||child.name == "Cube3"||
                   child.name == "Cube4"||child.name == "Cube5"){
                   child.material = medstarMaterial
                  } 
                   
                })
                
                carBox.scale.set(0.25, 0.25, 0.25)
      
            }
        )


        gltfLoader.load(

            '/models/jetbox.glb',
            (gltf) =>
            {   
                planeBoxParent= gltf
                console.log(planeBoxParent.scene)
                planeBox = gltf.scene
                planeBox.traverse((child) =>
                {
                    if(child.name ==  "Cube"||child.name ==  "Cube1"||
                    child.name ==  "Cube2"||child.name ==  "Cube3"||
                    child.name ==  "Cube4"||child.name ==  "Cube5"){
                    child.material = hallmarkMaterial
                    }
                    
                })
                
                planeBox.scale.set(0.25, 0.25, 0.25)
                // scene.add(planeBox)
      
            }
        )

        gltfLoader.load(

            '/models/hospital.glb',
            (gltf) =>

    
            {   
                console.log(gltf.scene)
                hospital = gltf.scene.children[1]
                airport = gltf.scene.children[0]

                
             
                
                
                // scene.add(planeBox)
      
            }
        )
 /**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('white', 1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('white', 1)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)

directionalLight.position.set(5, 5, -5)
scene.add(directionalLight)
directionalLight.shadow.mapSize.width = 512; // default
directionalLight.shadow.mapSize.height = 512; // default
directionalLight.shadow.camera.near = 0.5; // default
directionalLight.shadow.camera.far = 500; // default




/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(-20, 4, -14)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, -10)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setClearColor( 'gray',1);

// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

raycaster.setFromCamera(mouse, camera)



for (var i = 0; i < moreButton.length; i++) {
    moreButton[i].addEventListener('click',(event) =>
{ 

    var input = document.querySelector("#ask").value
    console.log(input)
    input = input.toLowerCase();

    if(input =="medstar" || input =="hallmark"){

    createBox(input)

    }
    else{
    input = input.split(" ");
    if(input[input.length-1]!=="please")
    {
        let annoyingDiv = document.createElement("div")
        let annoyingInput = document.createElement("input")
        let annoyingButton = document.createElement("div")
        let annoyingText = document.createElement("h2")
        annoyingButton.classList.add("annoyingButton")
        annoyingButton.classList.add("button")
        annoyingButton.innerHTML = "say please"

        annoyingDiv.classList.add("annoyingDiv")
        annoyingInput.setAttribute("id", "annoyingInput");
        annoyingText.innerHTML = "AH AH AH , you didn't say the magic word"
        annoyingDiv.appendChild(annoyingButton)
        annoyingDiv.appendChild(annoyingInput)
        annoyingDiv.appendChild(annoyingText)
        document.querySelector("body").prepend(annoyingDiv)
        console.log("annoying")

        document.querySelector(".menue").classList.add("hidden")
        document.querySelector(".slideshow").classList.add("hidden")
        ahahah.loop = true;
        ahahah.play()

        document.querySelector(".annoyingButton").addEventListener("click", ()=>{

            var sayPlease = document.querySelector("#annoyingInput").value
            
            if (sayPlease.toLowerCase()=="please"){
                document.querySelector(".menue").classList.remove("hidden")
                    document.querySelector(".slideshow").classList.remove("hidden")
                    document.querySelector("body").removeChild(document.querySelector(".annoyingDiv"))
                    clearInterval(annoyingInterval);
                    ahahah.loop=false
                    ahahah.pause()
            
            } 
            
            })

        
        

        var annoyingInterval = setInterval(() => {
            for(i=0; i<10; i++){
                setTimeout(() => {
                    
                
                createRandomBox(
                    Math.random()*.4+.2,
                    Math.random()*.4+.2,
                    Math.random()*.4+.2,
                    {
                        x: (Math.random() - 0.5) * 3,
                        y: 10,
                        z: (Math.random() - 0.5) * 3
                    },
                   Math.floor( Math.random()*4)+1
                )
            }, 100*i);
            }
            
        }, 2000);

    }
    else{
    for(i=0; i<10; i++){
        setTimeout(() => {
            
        
        createRandomBox(
            Math.random()*.4+.2,
            Math.random()*.4+.2,
            Math.random()*.4+.2,
            {
                x: (Math.random() - 0.5) * 3,
                y: 10,
                z: (Math.random() - 0.5) * 3
            },
           Math.floor( Math.random()*4)+1
        )
    }, 100*i);
    }
}
}

})

}
      



/**
 * Animate
 */


const clock = new THREE.Clock()
let oldElapsedTime = 0
let previousTime = 0
const tick = () =>
{

    // travelSpline()
    for(const object of objectsToUpdate)
    {   if(object.boxGroup){
        object.boxGroup.position.copy(object.boxBody.position)
        object.boxGroup.quaternion.copy(object.boxBody.quaternion)
    }
    if(object.boxGroup2){object.boxGroup2.position.copy(object.boxBody2.position)
        object.boxGroup2.quaternion.copy(object.boxBody2.quaternion)
    }
    if(object.body){
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
    }
    }
    
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    world.step(1 / 60, deltaTime, 3)


    floor.position.copy( floorBody.position)
    floor.quaternion.copy(floorBody.quaternion)

    if(mixer)
    {
        mixer.update(deltaTime)
    }

    if(planeCarGroup && rotate=="on"){

        planeCarGroup.rotation.y+=.01
    }

 
    controls.update()

    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()