import { AdvancedDynamicTexture,  Button, Rectangle, Control, TextBlock, ScrollViewer, StackPanel} from "@babylonjs/gui";
import { GUIPlay } from "./GUIPlay";
import { GUIFONT1 } from "../utils/CONSTANTS";
import { UpgradeWindowI } from "../../typings";

export class UpgradeWindow extends Rectangle implements UpgradeWindowI{
    protected _gui:GUIPlay;
    protected _closeUpgrades:Button;
    protected _windowTitle:TextBlock;
    protected _scrollViewer:ScrollViewer;
    protected _panelContainer:StackPanel;

    public name:string;

    constructor(name:string) {
        super(name)
        this.name = name;
        this.isVisible = false;

        //starter settings
        this.width = .5;
        this.height = 1;
        this.background = 'black';
        this.zIndex = 100;

        this._windowTitle  = new TextBlock(`${this.name} title`, `${this.name}`);
        this._windowTitle.fontFamily = GUIFONT1;
        this._windowTitle.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this._windowTitle.width = .5;
        this._windowTitle.height = '20px';
        this._windowTitle.top = 10;
        this._windowTitle.color = 'white';
        this.addControl(this._windowTitle);
        
        this._closeUpgrades = Button.CreateSimpleButton(`close${this.name}`, 'close');
        this._closeUpgrades.fontFamily = GUIFONT1;
        this._closeUpgrades.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this._closeUpgrades.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this._closeUpgrades.left = -10;
        this._closeUpgrades.top = 10;
        this._closeUpgrades.width = '75px';
        this._closeUpgrades.height = '75px';
        this._closeUpgrades.background = 'red';
        this._closeUpgrades.color= 'white';

        this.addControl(this._closeUpgrades);

        this._closeUpgrades.onPointerDownObservable.add(() => {

            this.hideWindow();

        })

        this._scrollViewer = new ScrollViewer(`${this.name} sv`);
        this._scrollViewer.width = 1 ;
        this._scrollViewer.height = '855px';
        this._scrollViewer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this._scrollViewer.top = '100px';
        this._scrollViewer.barSize = 15;
        this._scrollViewer.thickness = 0;
        this._scrollViewer.verticalBar.color = 'gray';
        this.addControl(this._scrollViewer);

        this._panelContainer = new StackPanel(`${this.name}_panelContainer`);
        this._scrollViewer.addControl(this._panelContainer);

    }

    public hideWindow():void {

            this.isVisible = false;

    }

    public showWindow():void {
        
            this.isVisible = true;
        
    }

    public getScrollViewer():ScrollViewer {
        return this._scrollViewer;
    }

    public getPanelContainer():StackPanel {
        return this._panelContainer;
    }


}