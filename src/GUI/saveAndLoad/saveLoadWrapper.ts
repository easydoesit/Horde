import { Button, Rectangle, Control, TextBlock, ScrollViewer, StackPanel} from "@babylonjs/gui";
import { GUIFONT1 } from "../../utils/CONSTANTS";
import { App } from "../../app";
import { dateMaker } from "../../utils/dateMaker";

export class SaveLoadWrapper extends Rectangle {
    protected _windowTitle:TextBlock;
    private _app:App;
    private _closeWindow:Button;
    private _scrollViewer:ScrollViewer;
    private _panelContainer:StackPanel;

    constructor(name:string, app:App) {
        super(name)
        this.name = name;
        this._app = app;
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

            if(data.body !== 'no files') {

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

                    fileButton.onPointerClickObservable.add(async () => {
                        const thisFileName = {fileName:fileNameFull};

                        const fileNameJSON = JSON.stringify(thisFileName);
                        console.log(fileNameJSON);

                        await fetch('http://localhost:3000/grabSaveData', {
                            method:'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: fileNameJSON,
                        })
                        .then(response => response.json())
                        .then(data => {
                            const dataObj = JSON.parse(data);
                            this._app.saveState.setFileName(`${fileName}_${dateMaker()}`);
                            this._app.saveState.setLoadInfo(dataObj);
                            this._app.scene.detachControl();
                            this._app.gameState.setGameState('PLAY_MODE');
                        })
                        .catch(error => {
                            console.error('Error: ', error);
                            
                        })

                    }) 

                    this.getPanelContainer().addControl(fileButton);

                }
            } else {

                const noFileTextBlock = new TextBlock('no Files', 'No Files Saved')
                noFileTextBlock.color = 'white';
                noFileTextBlock.width = .2;
                noFileTextBlock.height = '60px';
                this.getPanelContainer().addControl(noFileTextBlock);
            
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