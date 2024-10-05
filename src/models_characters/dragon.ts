import { AbstractMesh, TransformNode, Vector3, SceneLoader, Curve3,LinesMesh, Animation } from "@babylonjs/core";
import { DEBUGMODE } from "../utils/CONSTANTS";
import { PlayMode } from "../scenes/playmode";
import { createCurve, createAnimationPath, showPath} from "../utils/animations";
import { MatClickBox } from "../reusedAssets/materials";
import { dragonPaths, dragonLoopMaxMin } from "../utils/CONSTANTS";

export class Dragon extends TransformNode {
    public models:{name:string, meshes:{root:AbstractMesh, allMeshes:AbstractMesh[]}}[];
    public clickBox:{name:string, meshes:{root:AbstractMesh, allMeshes:AbstractMesh[]}};
    
    private _publicDir:string;
    private _importedModels:string[];
    
    public animations:Animation[];
    public scene:PlayMode;
    public clickable:boolean;

    constructor(name:string, scene:PlayMode){
        super(`${name}`, scene);
        this._publicDir = './models/';
        this._importedModels = ['dragon01.glb'];
        this.animations = [];
        this.models = [];
        this.scene = scene;
        this.initialize();

    }

    public async initialize():Promise<void> {
        //add all the models to the scene        
        for (let i = 0; i <= this._importedModels.length - 1; i++ ) {
            let name = this._importedModels[i];
            name  = name.slice(0 , -4);

            const model = await this._createModel(name,this._importedModels[i]);
            model.meshes.root.parent = this;

            this.models.push(model);
        }

        //hide the meshes of the other models
        for (let i = 1; i <= this.models.length - 1; i++ ) {
            for (let j = 0; j < this.models[i].meshes.allMeshes.length; j++) {
                this.models[i].meshes.allMeshes[j].isVisible = false;
            }
        }

        //create the click model which is invisible but in the scene for RayHits
        this.clickBox = await this._createModel('clickZone', 'dragonClickBox.glb');
        this.clickBox.meshes.root.parent = this;
        //hide the click zone
        const clickModelMaterial = new MatClickBox('dragonClickBoxMat', this.scene);
        this.clickBox.meshes.allMeshes[0].material = clickModelMaterial;
        this.clickBox.meshes.allMeshes[0].material.alpha = 0;

        if (this.models) {
            this.playDragon();
        }
        
    }

    async _createModel(name:string, importedModel:string):Promise<{name:string, meshes:{root:AbstractMesh, allMeshes:AbstractMesh[]}}>{
        const models = await SceneLoader.ImportMeshAsync('',this._publicDir, importedModel, this.scene);
        const root = models.meshes[0];
        const allMeshes = root.getChildMeshes();

        return {
            name:name,
            meshes: {
            root:root,
            allMeshes:allMeshes
            }
        }
    }

    private _getPath(list:Vector3[][]) {
        
        const index = list[Math.floor(Math.random() * list.length)]
        return index; 

    }

    public makeUnclickable() {
        this.clickable = false;
    }

    public makeClickable() {
        this.clickable = true;
    }

    public playDragon = () => {

        let randomInterval = Math.round(Math.random() * (dragonLoopMaxMin[0] - dragonLoopMaxMin[1]) + dragonLoopMaxMin[1]);
        const dragonPath = this._getPath(dragonPaths);
        let curve:Curve3;
        let path:Vector3[];
        this.makeClickable();

        setTimeout(async function() {
            curve = createCurve(dragonPath);
            
            path = createAnimationPath(curve);

            if(path && curve) {
                this._makeAnimation(path,curve);
            } else {
                console.error('Path or curve not ready')
            }
        }.bind(this), randomInterval);

    }

    private _makeAnimation(path:Vector3[], curve:Curve3) {
        let debugPath:LinesMesh;

        if (DEBUGMODE) {
            debugPath = showPath(curve);
        }

        const frameRate = 30;
        const pathFollowAnim = new Animation('dragonFlight', 'position', frameRate, Animation.ANIMATIONTYPE_VECTOR3);
        const pathFollowKeys = [];

        for (let i = 0; i < path.length; i++) {
            const position = path[i];

            pathFollowKeys.push({frame: i * frameRate, value:position});
        }

        pathFollowAnim.setKeys(pathFollowKeys);

        this.animations.push(pathFollowAnim);
        //this part should be removed.
        (this.scene as PlayMode).beginDirectAnimation(this, this.animations, 0, frameRate * path.length, false, 1, () => {
            //this.dispose();
            this.playDragon();
            
            if(DEBUGMODE) {
                debugPath.dispose();
            }

        })
    }
}