import { PlayMode } from '../scenes/playmode';
import { DEBUGMODE } from '../utils/CONSTANTS';

export class SaveState {
    private _scene:PlayMode;

    constructor(scene:PlayMode) {
        this._scene = scene;

        this.saveGame();
    
    }

    private async saveGame() {

        setInterval(() => {
            if (DEBUGMODE) {
                console.log('SaveState Interval Started');
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
            .then(response => response.json())
            .then(data => {
                console.log('Server Response', data);
            })
            .catch(error => {
                console.error('Error: ', error);
            })

        }, 1 * 15 * 1000)
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
