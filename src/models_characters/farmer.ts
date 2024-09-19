import { AbstractMesh, TransformNode, Vector3, Scene, SceneLoader, Curve3, Mesh, LinesMesh, MeshBuilder, Path3D, Animation } from "@babylonjs/core";
import { DEBUGMODE } from "../utils/CONSTANTS";
import { GUIPlay } from "../GUI/GUIPlay";
import { CastleToFarmPath } from "../utils/CONSTANTS";
import { createCurve, createAnimationPath, showPath} from "../utils/animations";

export class Farmer extends TransformNode{
    public model:{root:AbstractMesh, allMeshes:AbstractMesh[]};
    private _gui:GUIPlay;
    private _animations:Animation[];

    constructor(name:string, scene:Scene, gui:GUIPlay) {
        super(`farmer_${name}`, scene);
        this._gui = gui;
        this._animations = [];

        this.initialize();

    }

    public async initialize():Promise<void>{
        this.model = await this.createFarmer();
        this.model.root.parent = this;

        let path:Vector3[];
        let curve:Curve3;
        let name:string;

        curve = await createCurve(CastleToFarmPath);
        name = `pathOf${this.name}`;
        path = createAnimationPath(curve);
        this._makeAnimation(path,curve);

    }

    async createFarmer():Promise<{root:AbstractMesh, allMeshes:AbstractMesh[]}>{
        const models = await SceneLoader.ImportMeshAsync('','./models/', 'farmer.glb', this._scene)
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

            this._gui.farmerCount = this._gui.changeFarmerCount();
            
            if(DEBUGMODE) {
                debugPath.dispose();
            }
        });


    }
}