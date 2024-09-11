import { AbstractMesh, TransformNode, Vector3, Scene, SceneLoader, Curve3, Mesh, LinesMesh, MeshBuilder, Path3D, Animation } from "@babylonjs/core";
import { DEBUGMODE } from "../utils/CONSTANTS";
import { GUIPlay } from "../GUI/GUIPlay";

export class Farmer extends TransformNode{
    public model:{root:AbstractMesh, allMeshes:AbstractMesh[]}
    private _gui:GUIPlay;

    constructor(name:string, scene:Scene, gui:GUIPlay) {
        super(`farmer_${name}`, scene);
        //the start position also used in animation
        this.position = new Vector3(-2.8552, 6.0224, -0.29624);
        this._gui = gui;

        this.initialize();

    }

    public async initialize():Promise<void>{
        this.model = await this.createFarmer();
        this.model.root.parent = this;

        const path = await this._createAnimationPath();

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

    private async _createAnimationPath():Promise<void> {
        //simple path
        const catmullRom = Curve3.CreateCatmullRomSpline(
            [
                this.position,
                new Vector3(-2.3188, 5.3886, 0.96662),
                new Vector3(-3.7859, 2.5797, -1.9741),
                new Vector3(-4.064, 2.0743, 1.3783),
                new Vector3(-4.9398, 1.318, -0.38271),
                new Vector3(-5.9045, 0.667, 0.86373)
            ],
            3
        )
        //DEBUG visualize the path
        if (DEBUGMODE) {
        const visualFarmerPath = MeshBuilder.CreateLines('lines', {points:catmullRom.getPoints()})
        }

        //transfrom the curves into a proper 3D path
        const farmersPath = new Path3D(catmullRom.getPoints());
        const farmersPathCurve = farmersPath.getCurve();
        //create the animation
        const frameRate = 60;
        const pathFollowAnim = new Animation('farmerPosition', 'position',frameRate * 3 , Animation.ANIMATIONTYPE_VECTOR3)
        const pathFollowKeys = []

        for (let i = 0; i < farmersPathCurve.length; i++) {
            const position = farmersPathCurve[i];
            
            pathFollowKeys.push({frame: i * frameRate, value:position})
        }

        pathFollowAnim.setKeys(pathFollowKeys);
    
        this.animations.push(pathFollowAnim);

        this._scene.beginAnimation(this, 0, frameRate*farmersPathCurve.length, false, 1, () =>{
            this.dispose();
            
            this._gui.farmerCount = this._gui.increaseFarmerCount();
            this._gui.runningFarmers -= 1;

            //up the Goldpersecond
            this._gui.totalGoldPerSecond = Math.round(this._gui.increaseGoldPerSecond()*10000)/10000;

        });
    }



}