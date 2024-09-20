import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene } from "@babylonjs/core";

import {BabInspector} from "./debug/inspector";
import createCanvas from "./canvas/createCanvas";
import { StartScreen } from "./scenes/start_screen";
import { PlayMode } from "./scenes/playmode";
import { GameState } from "./gameControl/gameState";

export class App {
    //General Entire App
    private _engine:Engine;
    private _scene:Scene;
    private _canvas: HTMLCanvasElement;
    private _inspector:BabInspector;

    public gameState:GameState;
    public startScrean:StartScreen;
    public playMode:PlayMode;

    constructor() {
        // create the canvas html element and attach it to the webpage
        this._canvas = createCanvas();

        // initialize babylon engine
        this._engine = new Engine(this._canvas, true);

        //sceneList
        this.startScrean = new StartScreen(this, this._engine);
        this.playMode = new PlayMode(this, this._engine);
        this.playMode.detachControl();
        // run the main render loop
        this._main();
       
    }

    //Main Game Loop Options
    private async _main():Promise<void> {
        
        //set the initial Scene
        await this.switchScene(this.startScrean);
        
        // set the initial gameState
        this.gameState = new GameState('START_SCREEN');
        // add the inspector
        this._inspector = new BabInspector(this._scene);

         //run the render loop
        this._engine.runRenderLoop(() => {

            this._scene.render();
        });

    }

    //Scene Switching function
    public async switchScene(newScene:Scene) {
        
        //any controls are turned off if a scene exists
        if (this._scene) {
            this._scene.detachControl();
            this._scene.dispose();
        }

        this._scene = newScene;
        this._scene.attachControl();
        this._inspector = new BabInspector(this._scene);
    }



    ///
}
new App();