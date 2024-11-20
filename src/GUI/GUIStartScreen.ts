import { Scene } from "@babylonjs/core";
import { AdvancedDynamicTexture, Rectangle, Button, Control } from "@babylonjs/gui";

import { App } from "../app";
import { GameStateI, GameStateObserverI } from "../../typings";
import { PlayMode } from "../scenes/playmode";
import { GUIPlay } from "./GUIPlay";
import { DEBUGMODE, GUIFONT1 } from "../utils/CONSTANTS";
import { SaveLoadButton } from "./saveAndLoad/saveLoadButton";
import { SaveLoadWrapper } from "./saveAndLoad/saveLoadWrapper";

export class GUIStartScreen implements GameStateObserverI {
    public gameGUI:AdvancedDynamicTexture;
    public name:string;
    private _app:App;
    private _scene:Scene;
    private _startButton:Button
    private _saveLoadButton:Button;
    private _saveLoadWindow:SaveLoadWrapper;

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
  
          this._startButton = Button.CreateSimpleButton("start", "Start From Beginning");
          this._startButton.fontFamily = GUIFONT1;
          this._startButton.width = 0.2
          this._startButton.height = "40px";
          this._startButton.color = "white";
          this._startButton.top = "-360px";
          this._startButton.thickness = 2;
          this._startButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
          
          this._startScreenWrapper.addControl(this._startButton);
  
          this._startButton.onPointerClickObservable.add(() => {
                this._scene.detachControl();
                this._app.gameState.setGameState('PLAY_MODE');
                this._app.saveState.setActivateSave(true);  
              
          });

          this._saveLoadWindow = new SaveLoadWrapper('Save and Load Files')
          this.gameGUI.addControl(this._saveLoadWindow);
          this._saveLoadButton = new SaveLoadButton(this._startScreenWrapper, this._saveLoadWindow);

          this._saveLoadButton.top ='-320px';

    }

    public async updateGameState(): Promise<void> {
           
        if(this._app.gameState.state === 'PLAY_MODE') {
    
            if (DEBUGMODE) {
                console.log('Game in Playmode');
            }
        
            const newScene = new PlayMode(this._app);
            await this._app.switchScene(newScene).then(() => {
                this._app.gameState.detach(this);
                this._app.loadingScreen.hideLoadingUI();
                this._app.gui = new GUIPlay(this._app, newScene);
            });
            
            
        
        }

    }
    
}