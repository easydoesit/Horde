import {StandardMaterial} from "@babylonjs/core";
import {PlayMode} from  '../scenes/playmode';


export class MatClickBox extends StandardMaterial {

    constructor(name:string, scene:PlayMode) {
        super(name, scene)

        this._alpha = 0;

    }
}