import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { DefaultLoadingScreen, Engine, Scene } from "@babylonjs/core";

import {BabInspector} from "./debug/inspector";
import createCanvas from "./canvas/createCanvas";
import { StartScreen } from "./scenes/start_screen";
//import { PlayMode } from "./scenes/playmode";
import { GameState } from "./gameControl/gameState";
import { GUIStartScreen } from "./GUI/GUIStartScreen";
import { GUIPlay } from "./GUI/GUIPlay";

export class App {
    //General Entire App
    public engine:Engine;
    public scene:Scene;
    public gameState:GameState;
    public gui:GUIPlay | GUIStartScreen;
    private _canvas: HTMLCanvasElement;
    private _inspector:BabInspector;
    public loadingScreen:DefaultLoadingScreen;

    public startScreen:StartScreen;

    constructor() {
        // create the canvas html element and attach it to the webpage
        this._canvas = createCanvas();

        // initialize babylon engine
        this.engine = new Engine(this._canvas, true);

        //initialize
        this.gameState = new GameState('START_SCREEN');
        this.scene = new StartScreen(this.engine);
        this.gui = new GUIStartScreen(this, this.scene);

        // add the inspector
        this._inspector = new BabInspector(this.scene);

        this.loadingScreen = new DefaultLoadingScreen(this._canvas);
        
        // run the main render loop
        this._main();
    
    }

    //Main Game Loop Options
    private async _main():Promise<void> {
        
         //run the render loop
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

    }

    //Scene Switching function
    public async switchScene(newScene:Scene) {
        this.loadingScreen.displayLoadingUI();
        //any controls are turned off if a scene exists
        if (this.scene) {
            this.scene.detachControl();
            this.scene.dispose();
        }

        this.scene = newScene;
        this.scene.attachControl();
        this._inspector.scene = this.scene;
    }

    ///
}
new App();