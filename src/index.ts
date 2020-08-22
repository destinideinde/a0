import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3, Color3 } from "@babylonjs/core/Maths/math";
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { SpotLight } from "@babylonjs/core/Lights/spotLight";
import "@babylonjs/core/Materials/standardMaterial";

// Required side effects to populate the Create methods on the mesh class. Without this, the bundle would be smaller but the createXXX methods from mesh would not be accessible.
import {MeshBuilder} from  "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { ParticleSystem } from "@babylonjs/core/Particles/particleSystem";

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement; // Get the canvas element 
const engine = new Engine(canvas, true); // Generate the BABYLON 3D engine


/******* Add the Playground Class with a static CreateScene function ******/
class Playground { 
    public static CreateScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
        // Create the scene space
        const scene = new Scene(engine);
        var objects = [];

        // (1) Create a universal camera.
        var camera = new UniversalCamera("UniversalCamera", new Vector3(0, 0, -10), scene);
        camera.setTarget(Vector3.Zero());
        camera.attachControl(canvas, true);

        // (2) Create a ground plane w/ interesting material.
        var groundPlane = MeshBuilder.CreatePlane(
                "ground plane", 
                { 
                    width : 10,
                    height : 10
                },
                scene);
        groundPlane.position = new Vector3(0, -.5, -10);
        groundPlane.rotation.x = Math.PI * .5;
        var groundMaterial = new StandardMaterial("textures/groundTextureSrc", scene);
        groundMaterial.diffuseTexture = new Texture("textures/groundTextureSrc.png", scene);
        groundMaterial.specularTexture = new Texture("textures/groundTextureSrc.png", scene);
        groundMaterial.emissiveTexture = new Texture("textures/groundTextureSrc.png", scene);
        groundMaterial.ambientTexture = new Texture("textures/groundTextureSrc.png", scene);
        groundPlane.material = groundMaterial;
        //groundPlane.receiveShadows = true;

        // (3) Add directional light that is not very bright. And point light high above.
        var light = new DirectionalLight("light1", new Vector3(1, 1, 0), scene);
        light.diffuse = new Color3(0, 1, 1);
        light.specular = new Color3(0, 1, 1);
        light.intensity = .5;
        var light2 = new SpotLight("spotLight", new Vector3(0, 3, 0), new Vector3(0, -1, 0), Math.PI * .875,  2, scene);

        // Add and manipulate meshes in the scene
        var sphere = MeshBuilder.CreateSphere("sphere", {diameter:2}, scene);
        sphere.position = new Vector3(0, 1, 2);
        //objects.push(sphere);
        
        // (6) Add particle system.
        var particleSystem = new ParticleSystem("particles", 2000, scene);
        particleSystem.emitter = sphere;
        particleSystem.particleTexture = new Texture("textures/groundTextureSrc.png", scene);
        particleSystem.minEmitBox = Vector3.Zero();
        particleSystem.maxEmitBox = new Vector3(1, 1, 1);
        particleSystem.start();


        // (7) Add shadows.
        // var shadowGeneratorDirectional = new ShadowGenerator(1024, light);
        //var shadowGeneratorSpot = new ShadowGenerator(1024, light2);
        //shadowGeneratorDirectional.addShadowCaster(sphere);
        //shadowGeneratorSpot.addShadowCaster(sphere);

       // for (var i = 0; i < objects.length; i++) {
         //   if (objects[i] != null) {
                //shadowGeneratorDirectional.getShadowMap().renderList.push(objects[i]);
                //shadowGeneratorSpot.getShadowMap().renderList.push(objects[i]);
           // }
        //}

        return scene;
    }
}

/******* End of the create scene function ******/    
// code to use the Class above
const createScene = function(): Scene { 
    return Playground.CreateScene(engine, 
        engine.getRenderingCanvas() as HTMLCanvasElement); 
}

const scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () { 
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () { 
    engine.resize();
});
