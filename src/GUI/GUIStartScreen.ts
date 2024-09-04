import { Scene } from "@babylonjs/core";
import { AdvancedDynamicTexture, Rectangle, Button, Control } from "@babylonjs/gui";

import { App } from "../app";

export class GUIStartScreen {
    public gameGUI:AdvancedDynamicTexture;

    private _app:App;
    private _scene:Scene;
    private _startScreenWrapper:Rectangle;

    constructor(app:App, scene:Scene) {
        this._app = app;
        this._scene = scene;


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
              
              this._app.switchScene(this._app.plains);
  
          });
          
    }
}