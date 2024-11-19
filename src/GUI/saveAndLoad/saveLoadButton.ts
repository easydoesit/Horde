import { Rectangle, Button, Control, TextBlock } from "@babylonjs/gui";
import { GUIFONT1 } from "../../utils/CONSTANTS";
import { SaveLoadWrapper } from "./saveLoadWrapper";

export class SaveLoadButton extends Button {
    private _window:Rectangle
    private _saveLoadWindow:SaveLoadWrapper
    private _text:TextBlock;

    constructor(controllerWindow:Rectangle, saveLoadWindow:SaveLoadWrapper){
        super('saveLoadButton')

        this._window = controllerWindow;
        this._saveLoadWindow = saveLoadWindow;

        this._text = new TextBlock('Load', 'Load a SaveFile');
        this.addControl(this._text);

        this.fontFamily = GUIFONT1;
        this.width = 0.2
        this.height = "40px";
        this.color = "white";
        this.thickness = 2;
        this.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;

        this._window.addControl(this);

        this.onPointerClickObservable.add(() => {
            this._saveLoadWindow.showWindow();
        })

    }
}