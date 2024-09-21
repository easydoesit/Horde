import { AbstractMesh, TransformNode, Vector3, SceneLoader, Curve3,LinesMesh, Animation } from "@babylonjs/core";
import { DEBUGMODE } from "../utils/CONSTANTS";
import { GUIPlay } from "../GUI/GUIPlay";
import { PlayMode } from "../scenes/playmode";


import { createCurve, createAnimationPath, showPath} from "../utils/animations";
import { Dragon } from "../models_characters/dragon";
import { eggFallPath } from "../utils/CONSTANTS";

export class Egg extends TransformNode {
    public model:{root:AbstractMesh, allMeshes:AbstractMesh[]};
    private _gui:GUIPlay;
    private _animations:Animation[];
    public scene:PlayMode;
    private _animeFrameRate:Number | BigInt | any;
    private _path:Vector3[];
    private _dragon:Dragon

    constructor(name:string, scene:PlayMode, gui:GUIPlay, dragon:Dragon) {
        super(`egg_${name}`, scene);
        this._animeFrameRate = 60;
        this._dragon = dragon;

        this.initialize();

    }

    public async initialize():Promise<void> {
        

        this.model = await this.createEgg();

        this.model.root.parent = this;
        
    }

    async createEgg():Promise<{root:AbstractMesh, allMeshes:AbstractMesh[]}>{
        const models = await SceneLoader.ImportMeshAsync('', './models/', 'egg.glb')
        const root = models.meshes[0];
        const allMeshes = root.getChildMeshes();

        return {
            root:root,
            allMeshes:allMeshes
        }
    }

    private makeDebugPath(curve:Curve3){

        let debugPath:LinesMesh;

        if (DEBUGMODE) {
            debugPath = showPath(curve);
        }
    } 

    private destroyDebugPath(debugLinesMesh:LinesMesh) {
        if (DEBUGMODE) {
            debugLinesMesh.dispose();
        }
    } 

    private _makeAnimation(path:Vector3[]) {
       
        const frameRate = this._animeFrameRate;
        const pathFollowAnim = new Animation('eggFall', 'position', frameRate * 1, Animation.ANIMATIONTYPE_VECTOR3);
        const pathFollowKeys = [];

        for (let i = 0; i < path.length; i++) {
            const position = path[i];

            pathFollowKeys.push({frame: i * frameRate, value:position});
        }

        pathFollowAnim.setKeys(pathFollowKeys);

        this.animations.push(pathFollowAnim);

    }

    public async runAnimation() {
        let curve:Curve3;        
        curve = await createCurve(eggFallPath(this._dragon.position));
        this._path = createAnimationPath(curve);

        this._makeAnimation(this._path);
        
        this._scene.beginAnimation(this, 0, this._animeFrameRate * this._path.length, false, 1, () => {
            this.dispose();
        })

    } 
}
