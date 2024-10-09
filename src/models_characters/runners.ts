import { AbstractMesh, TransformNode, Vector3, SceneLoader, Curve3,LinesMesh, Animation } from "@babylonjs/core";
import { DEBUGMODE} from "../utils/CONSTANTS";
import { createCurve, createAnimationPath, showPath} from "../utils/animations";
import { PlayMode } from "../scenes/playmode";


export class Runner extends TransformNode {
    public model:{root:AbstractMesh, allMeshes:AbstractMesh[]};
    private _departLoc:number;
    private _modelDirectory:string;
    private _modelFile:string;
    private _paths:(Vector3[])[];
    private _endOfAnim: any;
    private _frameRate:number;
    
    public scene:PlayMode;

    constructor(name:string, count:number, modelDirectory:string, modelFile:string,  scene:PlayMode, departLoc:number, paths:(Vector3[])[], endOfRun:any) {
        super(`${name}_${count}`, scene);
        this._departLoc = departLoc;
        this._modelDirectory = modelDirectory;
        this._modelFile = modelFile;
        this._paths = paths;
        this._endOfAnim = endOfRun;

        this._frameRate = 60
    
        this.initialize();
    }

    public async initialize(): Promise<void> {
        this.model = await this.createCharacter();
        
        this.model.root.parent = this;
        
        let path:Vector3[];
        let curve:Curve3;
        let name:string;
        
        switch(this._departLoc) {
            case 0:  {
                curve = createCurve(this._paths[0])
            }
            break;

            case 1: {
                curve = createCurve(this._paths[1]);
                
            }
            break;
            
            case 2:{
                curve = createCurve(this._paths[2]);
                
            }
            break;
            
            case 3: {
                curve = createCurve(this._paths[3]);
                
            }
            break;
        }

        name = this._departLoc.toLocaleString();
        path = createAnimationPath(curve);

        this._makeAnimation(path);
        this.playAnimation(path, curve, this._endOfAnim);

        if (DEBUGMODE) {
            console.log(this.name);
        }
    
    }

    async createCharacter():Promise<{root:AbstractMesh, allMeshes:AbstractMesh[]}>{
        const models = await SceneLoader.ImportMeshAsync('', this._modelDirectory, this._modelFile , this.scene)
        const root = models.meshes[0];
        const allMeshes = root.getChildMeshes();

        return {
            root:root,
            allMeshes:allMeshes
        }
    }

    private _makeAnimation(path:Vector3[]) {

        const pathFollowAnim = new Animation(`${this.name} Position`, 'position', this._frameRate * 3 , Animation.ANIMATIONTYPE_VECTOR3)
        const pathFollowKeys = [];

        for (let i = 0; i < path.length; i++) {
            const position = path[i];
            
            pathFollowKeys.push({frame: i * this._frameRate, value:position})
        }
    
        pathFollowAnim.setKeys(pathFollowKeys);
     
        this.animations.push(pathFollowAnim);

    }

    public playAnimation(path:Vector3[], curve:Curve3, endOfAnim:any) {
        
        let debugPath:LinesMesh;

        if (DEBUGMODE) {
            debugPath = showPath(curve);
        }
        
        
        this._scene.beginAnimation(this, 0, this._frameRate * path.length, false, 1, () =>{
            this.dispose();
            
            if (endOfAnim) {
                endOfAnim();
            }
            
            if(DEBUGMODE) {
                debugPath.dispose();
            }
        });
    }

}