import { App } from '../app';
import { PlayMode } from '../scenes/playmode';
import { DEBUGMODE } from '../utils/CONSTANTS';

export class SaveState {
    private _app:App
    private _activateSave:Boolean
    private _scene:PlayMode;
    private _fileName:string;
    private _gameSaveInt:ReturnType<typeof setInterval> | null
    
    constructor(app:App) {
        this._app = app;
        this._activateSave = false;
        // this._fileName = filename;
        // this._scene = scene;
        this._gameSaveInt = null;
    
    }

    private _saveGameInterval() {
        
        if (this._activateSave && !this._gameSaveInt) {

            this._gameSaveInt = setInterval(() => this._saveGame(), 1 * 3 * 1000);
        
        } else {
            clearInterval(this._gameSaveInt);
            this._gameSaveInt = null;
        }
    }

    private async _saveGame() {
        if (DEBUGMODE) {
            console.log('SaveGame Called');
        }

        const gameInfo = {
            table:[]
        }

        gameInfo.table.push({test:'Hello File', value:0});
        const gameSaveJSON = JSON.stringify(gameInfo);
        console.log(gameSaveJSON);

        fetch('http://localhost:3000/saveFile', {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:gameSaveJSON
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            debugger;
            return response.json()
            })
        .then(data => {
            debugger;
            console.log('Server Response', data);
            debugger;
        })
        .catch(error => {
            debugger;
            console.error('Error: ', error);
            
        })

    }

    public async loadGame() {
        if (DEBUGMODE) {
            console.log('LoadGame Called From Save State');
        }
    }

    public setActivateSave(active:boolean):void {
        this._activateSave = active;
        if (!active && this._gameSaveInt) {
        
            clearInterval(this._gameSaveInt);
            this._gameSaveInt = null;
        
        } else {
        
            this._saveGameInterval();
        
        }
    }

}

//timer for 2 mins
//get farmer amount
//get gold amount
//get all resource amounts
//get gold multiplyers
//get resource mutliplyers
//get all structure states
//get all standardUpgrade States
//get all epic upgrades States
//get prestige Level

//create a json string and save

//load a json file and start game
