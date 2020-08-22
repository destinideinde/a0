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

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement; // Get the canvas element 
const engine = new Engine(canvas, true); // Generate the BABYLON 3D engine


/******* Add the Playground Class with a static CreateScene function ******/
class Playground { 
    public static CreateScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
        // Create the scene space
        const scene = new Scene(engine);

        // Parameters : name, position, scene

        // (1) Create a universal camera.
        var camera = new UniversalCamera("UniversalCamera", new Vector3(0, 0, -10), scene);
        camera.setTarget(Vector3.Zero());
        camera.attachControl(canvas, true);

        // (2) Create a ground plane w/ interesting material.
        var groundPlane = MeshBuilder.CreatePlane(
                "ground plane", 
                { 
                    width : 5,
                    height : 5
                },
                scene);
        var groundMaterial = new StandardMaterial("textures/groundTextureSrc", scene);
        groundMaterial.diffuseTexture = new Texture("textures/groundTextureSrc.png", scene);
        groundMaterial.specularTexture = new Texture("textures/groundTextureSrc.png", scene);
        groundMaterial.emissiveTexture = new Texture("textures/groundTextureSrc.png", scene);
        groundMaterial.ambientTexture = new Texture("textures/groundTextureSrc.png", scene);
        groundPlane.material = groundMaterial;

        // (3) Add directional light that is not very bright. And point light high above.
        var light = new DirectionalLight("light1", new Vector3(1, 1, 0), scene);
        light.diffuse = new Color3(0, 1, 1);
        light.specular = new Color3(0, 1, 1);
        light.intensity = .5;
        
        var light2 = new SpotLight("spotLight", new Vector3(0, 5, 0), new Vector3(0, -1, 0), Math.PI * .875,  2, scene);


        // Add and manipulate meshes in the scene
        MeshBuilder.CreateSphere("sphere", {diameter:2}, scene);

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
