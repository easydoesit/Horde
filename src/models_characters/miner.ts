import { AbstractMesh, TransformNode, Vector3, SceneLoader, Curve3,LinesMesh, Animation } from "@babylonjs/core";
import { DEBUGMODE } from "../utils/CONSTANTS";

import { FarmToMinepath01, FarmToMinepath02,FarmToMinepath03,FarmToMinepath04 } from "../utils/CONSTANTS";

import { createCurve, createAnimationPath, showPath} from "../utils/animations";
import { PlayMode } from "../scenes/playmode";

export class Miner extends TransformNode {
    public model:{root:AbstractMesh, allMeshes:AbstractMesh[]};
    private _departFarm:number;
    public scene:PlayMode;

    constructor(name:string, scene:PlayMode, departFarm:number) {
        super(`miner_${name}`, scene);
        this._departFarm = departFarm;
      
        this.initialize();
    }

    public async initialize():Promise<void>{
        this.model = await this.createMiner();
        this.model.root.parent = this;
        
        let path:Vector3[];
        let curve:Curve3;
        let name:string;
        
        
        switch(this._departFarm) {
            case 0:  {
                curve = createCurve(FarmToMinepath01)
            }
            break;
            case 1: {
                curve = createCurve(FarmToMinepath02);
                
            }
            break;
            case 2:{
                curve = createCurve(FarmToMinepath03);
                
            }
            break;
            case 3: {
                curve = createCurve(FarmToMinepath04);
                
            }
            break;
        }
        name = this._departFarm.toLocaleString();
        path = createAnimationPath(curve);
        //makeAnimation(name, path, curve, this._animations, this, this.scene);
        this._makeAnimation(path,curve);
        
    }

    async createMiner():Promise<{root:AbstractMesh, allMeshes:AbstractMesh[]}>{
        const models = await SceneLoader.ImportMeshAsync('','./models/', 'miner.glb', this.scene)
        const root = models.meshes[0];
        const allMeshes = root.getChildMeshes();

        return {
            root:root,
            allMeshes:allMeshes
        }
    }


    private _makeAnimation(path:Vector3[], curve:Curve3) {
        let debugPath:LinesMesh;

        if (DEBUGMODE) {
            debugPath = showPath(curve);
        }
        
        const frameRate = 60;
        const pathFollowAnim = new Animation('farmerPosition', 'position',frameRate * 3 , Animation.ANIMATIONTYPE_VECTOR3)
        const pathFollowKeys = [];

        for (let i = 0; i < path.length; i++) {
            const position = path[i];
            
            pathFollowKeys.push({frame: i * frameRate, value:position})
        }
    
        pathFollowAnim.setKeys(pathFollowKeys);
     
        this.animations.push(pathFollowAnim);

        this._scene.beginAnimation(this, 0, frameRate * path.length, false, 1, () =>{
            this.dispose();
            
            if(DEBUGMODE) {
                debugPath.dispose();
            }
        });
    }
}