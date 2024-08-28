import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder } from "@babylonjs/core";
import showBabInspector from "./debug/inspector";
import createCanvas from "./canvas/createCanvas";
import { StartScreen } from "./scenes/start_screen";

class App {
    //General Entire App
    private _engine:Engine;
    private _scene:Scene;
    private _canvas: HTMLCanvasElement;


    constructor() {
        // create the canvas html element and attach it to the webpage
        this._canvas = createCanvas();

        // initialize babylon engine
        this._engine = new Engine(this._canvas, true);

        // run the main render loop
        this._main();
       
    }

    //Main Game Loop Options
    private async _main():Promise<void> {
        await this._gotoStartScreen();
         // hide/show the Inspector
         showBabInspector(this._scene);

        this._engine.runRenderLoop(() => {
            this._scene.render();
        });

    }

    //Scene Switching functions
    private async _gotoStartScreen() {
        this._scene = new StartScreen(this._engine,this._canvas);
    }

    ///
}
new App();