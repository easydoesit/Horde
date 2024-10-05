import { Scene } from "@babylonjs/core";
import { AdvancedDynamicTexture, Rectangle, Button, Control } from "@babylonjs/gui";

import { App } from "../app";
import { GameStateI, GameStateObserverI } from "../../typings";
import { PlayMode } from "../scenes/playmode";
import { GUIPlay } from "./GUIPlay";
import { DEBUGMODE } from "../utils/CONSTANTS";

export class GUIStartScreen implements GameStateObserverI {
    public gameGUI:AdvancedDynamicTexture;
    public name:string;
    private _app:App;
    private _scene:Scene;

    private _startScreenWrapper:Rectangle;

    constructor(app:App, scene:Scene) {
        this.name = 'GUIStartScreen'
        this._app = app;
        this._scene = scene;

        this._app.gameState.attach(this);

        this.gameGUI = AdvancedDynamicTexture.CreateFullscreenUI('GameGui')
        this.gameGUI.idealHeight = 1080;
        this.gameGUI.idealWidth = 1920;

          //Start Screen
          this._startScreenWrapper = new Rectangle('startwrapper');
          this._startScreenWrapper.width = 0.8;
          this._startScreenWrapper.thickness = 1;
          this.gameGUI.addControl(this._startScreenWrapper);
  
          const startBtn = Button.CreateSimpleButton("start", "Start");
          startBtn.fontFamily = "Arial";
          startBtn.width = 0.2
          startBtn.height = "40px";
          startBtn.color = "white";
          startBtn.top = "-360px";
          startBtn.thickness = 2;
          startBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
          
          this._startScreenWrapper.addControl(startBtn);
  
          startBtn.onPointerDownObservable.add(() => {
              this._scene.detachControl();
              this._app.gameState.setGameState('PLAY_MODE');
          });

    }

    public updateGameState(gamestate: GameStateI): void {
           
        if(this._app.gameState.state === 'PLAY_MODE') {
    
            if (DEBUGMODE) {
                console.log('Game in Playmode');
            }
        
            const newScene = new PlayMode(this._app);
            this._app.switchScene(newScene);
            this._app.gui = new GUIPlay(this._app, newScene);
            this._app.gameState.detach(this);
        
        }

    }
    
}