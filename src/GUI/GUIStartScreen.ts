import { Scene } from "@babylonjs/core";
import { AdvancedDynamicTexture, Rectangle, Button, Control, InputText } from "@babylonjs/gui";

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
    private _startFromBeginningButton:Button
    private _saveNameInput:InputText;
    private _startGame:Button;
    private _cancel:Button;
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

        this._startFromBeginningButton = Button.CreateSimpleButton("start", "Start From Beginning");
        this._startFromBeginningButton.fontFamily = GUIFONT1;
        this._startFromBeginningButton.width = 0.2
        this._startFromBeginningButton.height = "40px";
        this._startFromBeginningButton.color = "white";
        this._startFromBeginningButton.top = "-480px";
        this._startFromBeginningButton.thickness = 2;
        this._startFromBeginningButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        
        this._startScreenWrapper.addControl(this._startFromBeginningButton);

        this._saveNameInput = new InputText('inputTextSave', 'Filename at least 4 characters no spaces');
        this._saveNameInput.width = 0.5;
        this._saveNameInput.height = '50px';
        this._saveNameInput.color = 'white';
        this._saveNameInput.top = '-480px';
        this._saveNameInput.thickness = 2;
        this._saveNameInput.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM
        this._saveNameInput.isVisible = false;

        this._startGame = Button.CreateSimpleButton("start", "Start");
        this._startGame.fontFamily = GUIFONT1;
        this._startGame.width = 0.2
        this._startGame.height = "40px";
        this._startGame.color = "white";
        this._startGame.top = "-420px";
        this._startGame.thickness = 2;
        this._startGame.left = '-150px';
        this._startGame.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this._startGame.isVisible = false;
        this._startScreenWrapper.addControl(this._startGame);

        this._cancel = Button.CreateSimpleButton("cancel", "Cancel");
        this._cancel.fontFamily = GUIFONT1;
        this._cancel.width = 0.2
        this._cancel.height = "40px";
        this._cancel.color = "white";
        this._cancel.top = "-420px";
        this._cancel.thickness = 2;
        this._cancel.left = '150px';
        this._cancel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this._cancel.isVisible = false;
        this._startScreenWrapper.addControl(this._cancel);

        this._startGame.onPointerClickObservable.add(() => {
            if(this._saveNameInput.text.length > 4 && !this._saveNameInput.text.includes(' ')) { 
                this._scene.detachControl();
                this._app.gameState.setGameState('PLAY_MODE');
                this._app.saveState.setFileName(this._saveNameInput.text);
                this._app.saveState.setActivateSave(true);
            } else {
                alert('you need more than 4 characters and no spaces');
            }
        });

        this._cancel.onPointerClickObservable.add(() => {
            this._startFromBeginningButton.isVisible = true;
            this._saveNameInput.isVisible = false;
            this._startGame.isVisible = false;
            this._cancel.isVisible = false;
            this._saveLoadButton.isVisible = true;
        });

        this._startFromBeginningButton.onPointerClickObservable.add(() => {
            this._startFromBeginningButton.isVisible = false;
            this._saveNameInput.isVisible = true;
            this._startGame.isVisible = true;
            this._cancel.isVisible = true;
            this._saveLoadButton.isVisible = false;
        });

        this._startScreenWrapper.addControl(this._saveNameInput);

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