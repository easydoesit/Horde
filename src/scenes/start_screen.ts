import { Engine, Scene, ArcRotateCamera,HemisphericLight, Mesh, MeshBuilder, Vector3 } from "@babylonjs/core";
import showBabInspector from "../debug/inspector";

export class StartScreen extends Scene {
    private _canvas:HTMLCanvasElement;

    constructor(engine:Engine, canvas:HTMLCanvasElement) {
        super(engine);
        this._canvas = canvas;

    var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), this);
        camera.attachControl(this._canvas, true);
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), this);
        var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, this);

       

    }

}