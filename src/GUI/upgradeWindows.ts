import { AdvancedDynamicTexture,  Button, Rectangle, Control, TextBlock} from "@babylonjs/gui";
import { GUIPlay } from "./GUIPlay";
import { GUIFONT1 } from "../utils/CONSTANTS";

export class UpgradeWindow extends Rectangle {
    private _gui:GUIPlay;
    private _closeUpgrades:Button;

    constructor(name:string, backgroundColor:string, gui:GUIPlay) {
        super(name)

        this.width = 0.5;
        this.height = 1;
        this.thickness = 1;
        this.background = backgroundColor;
        gui.gameGUI.addControl(this);

        this.isVisible = false;

        this._closeUpgrades = Button.CreateSimpleButton(`close${this.name}`, 'close');
        this._closeUpgrades.fontFamily = GUIFONT1;
        this._closeUpgrades.left = 430;
        this._closeUpgrades.top = -430;
        this._closeUpgrades.width = .075;
        this._closeUpgrades.height = .075;
        this._closeUpgrades.background = 'red';
        this._closeUpgrades.color= 'white';

        this.addControl(this._closeUpgrades);

        this._closeUpgrades.onPointerDownObservable.add(() => {

            this.hideUpgrades(this);

        })
    }

    public hideUpgrades(wrapper:Rectangle) {

        if (wrapper.isVisible) {

            wrapper.isVisible = false;
        }
    }


}