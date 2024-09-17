import { AbstractMesh, TransformNode, Vector3, Scene, SceneLoader, Curve3, Mesh, LinesMesh, MeshBuilder, Path3D, Animation } from "@babylonjs/core";
import { DEBUGMODE } from "../utils/CONSTANTS";
import { GUIPlay } from "../GUI/GUIPlay";

import { FarmHouse01Pos, FarmHouse02Pos, FarmHouse03Pos, FarmHouse04Pos } from "../utils/CONSTANTS";

export class Miner extends TransformNode {
    public model:{root:AbstractMesh, allMeshes:AbstractMesh[]};
    private _gui:GUIPlay;

    constructor(name:string, scene:Scene, gui:GUIPlay) {
        super(`miner_${name}`, scene);
        //the start position also used in animation
        this.position = new Vector3(-2.8552, 6.0224, -0.29624);
        this._gui = gui;

        this.initialize();

    }

    public async initialize():Promise<void>{
        this.model = await this.createMiner();
        this.model.root.parent = this;

        const path01 = await this._createFarm01toMineAnimationPath();
        // const path02 = await this._createFarm02toMineAnimationPath();
        // const path03 = await this._createFarm03toMineAnimationPath();
        // const path04 = await this._createFarm04toMineAnimationPath();

    }

    async createMiner():Promise<{root:AbstractMesh, allMeshes:AbstractMesh[]}>{
        const models = await SceneLoader.ImportMeshAsync('','./models/', 'miner.glb', this._scene)
        const root = models.meshes[0];
        const allMeshes = root.getChildMeshes();

        return {
            root:root,
            allMeshes:allMeshes
          
        }
    }

    private async _createFarm01toMineAnimationPath() {
        const catmullRom = Curve3.CreateCatmullRomSpline (
            [FarmHouse01Pos,
                new Vector3(-4.9398, 1.318, -0.38271),
            ],
            3
        )

        //DEBUG visualize the path
        if (DEBUGMODE) {
        const visualMinerPath = MeshBuilder.CreateLines('lines', {points:catmullRom.getPoints()})
        }

        //transfrom the curves into a proper 3D path
        const minersPath = new Path3D(catmullRom.getPoints());
        const minersPathCurve = minersPath.getCurve();

        //create the animation
        const frameRate = 60;
        const pathFollowAnim = new Animation('farmerPosition', 'position',frameRate * 3 , Animation.ANIMATIONTYPE_VECTOR3)
        const pathFollowKeys = []

        for (let i = 0; i < minersPathCurve.length; i++) {
            const position = minersPathCurve[i];
            
            pathFollowKeys.push({frame: i * frameRate, value:position})
        }
 
         pathFollowAnim.setKeys(pathFollowKeys);
     
         this.animations.push(pathFollowAnim);
 
         this._scene.beginAnimation(this, 0, frameRate*minersPathCurve.length, false, 1, () =>{
             this.dispose();
             
            //  this._gui.farmerCount = this._gui.increaseFarmerCount();
            //  this._gui.runningFarmers -= 1;
 
            //  //up the Goldpersecond
            //  this._gui.totalGoldPerSecond = Math.round(this._gui.increaseGoldPerSecond()*10000)/10000;
 
         });
    }

}