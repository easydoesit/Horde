import { Button, Rectangle, Control, TextBlock, ScrollViewer, StackPanel} from "@babylonjs/gui";
import { GUIFONT1 } from "../../utils/CONSTANTS";

export class SaveLoadWrapper extends Rectangle {
    protected _windowTitle:TextBlock;
    private _closeWindow:Button;
    private _scrollViewer:ScrollViewer;
    private _panelContainer:StackPanel;

    constructor(name:string) {
        super(name)
        this.name = name;
        this.isVisible = false;

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

        this._closeWindow = Button.CreateSimpleButton(`close${this.name}`, 'close');
        this._closeWindow.fontFamily = GUIFONT1;
        this._closeWindow.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this._closeWindow.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this._closeWindow.left = -10;
        this._closeWindow.top = 10;
        this._closeWindow.width = '75px';
        this._closeWindow.height = '75px';
        this._closeWindow.background = 'red';
        this._closeWindow.color= 'white';

        this.addControl(this._closeWindow);

        this._closeWindow.onPointerDownObservable.add(() => {

            this.hideWindow();

        });

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

        this._getSaveFiles();

    }

    private async _getSaveFiles() {
        fetch('http://localhost:3000/listSaveFiles', {
            method:'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(response => response.json())
        .then(data => {
            console.log('Server Response: ', data);
            for (let i in data) {
                const fileNameFull = data[i];
                const fileName = fileNameFull.replace(/\.[^/.]+$/, "");
                const fileButton = new Button(`${fileName}`);

                fileButton.fontFamily = GUIFONT1;
                fileButton.width = 0.4
                fileButton.color = "white";
                fileButton.thickness = 2;
                fileButton.height = '60px';
                fileButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
                fileButton.left = -10;
                const textBlock = new TextBlock(`${fileName}`, `${fileName}`);
                fileButton.addControl(textBlock);
                this.getPanelContainer().addControl(fileButton);

            }

        })
        .catch(error => {
            console.error('Error: ', error);
        })
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