import { AbstractMesh, TransformNode, Vector3, SceneLoader, Curve3,LinesMesh, Animation } from "@babylonjs/core";
import { ogreLoopMaxMin, ogrePaths, ogreClicks } from "../utils/CONSTANTS";
import { GUIPlay } from "../GUI/GUIPlay";
import { PlayMode } from "../scenes/playmode";
import { MatClickBox } from "../reusedAssets/materials";
import { ogreIntervalTime } from "../utils/MATHCONSTANTS";

export class Ogre extends TransformNode {
    public models:{name:string, meshes:{root:AbstractMesh, allMeshes:AbstractMesh[]}}[];
    public clickBox:{name:string, meshes:{root:AbstractMesh, allMeshes:AbstractMesh[]}};

    private _publicDir;
    private _gui:GUIPlay;
    private _importedModels:string[];

    public animations:Animation[];
    private _animationStartFrame:number;

    public scene:PlayMode;

    public clickable:boolean;
    public ogreAttack:boolean;
    public clicksLeft:number;
    private _ogreInterval:ReturnType<typeof setInterval>;

    private _animOgreEnterPos:Vector3
    private _animOgreAttackPos:Vector3
    private _animOgreExitPos:Vector3

    private _keyFrameStartEnterToAttack:number;
    private _keyFramesEndEnterToAttack:number;
    
    private _keyFramesStartAttackToExit:number;
    private _keyFramesEndAttackToExit:number;
    
    constructor(name:string, scene:PlayMode, gui:GUIPlay) {
        super(`ogre`, scene);
        this._publicDir = './models/';
        this._importedModels = ['ogre.glb'];
        this._gui = gui;
        this.animations = [];
        this.models = [];
        this.scene = scene;
        this.clicksLeft = ogreClicks;
        console.log("animations at before initialize: ", this.animations);

        this._animOgreEnterPos = new Vector3(-6,1.1, 18);
        this._animOgreAttackPos = new Vector3(-6,1.1, -5);
        this._animOgreExitPos = new Vector3(-6,1.1, -18);

        this._keyFrameStartEnterToAttack = 0;
        this._keyFramesEndEnterToAttack = 600;

        this._keyFramesStartAttackToExit = 700;
        this._keyFramesEndAttackToExit = 820;

        this.initialize();

        const transfromPosition = new Animation('ogrePlacementTransform', 'position', 60, Animation.ANIMATIONTYPE_VECTOR3);

        const transfromPositionAnimKeyFrames = [
            {
                frame:this._keyFrameStartEnterToAttack,
                value:this._animOgreEnterPos,
            },
            {
                frame:this._keyFramesEndEnterToAttack,
                value:this._animOgreAttackPos, 
            },
            {
                frame: this._keyFramesStartAttackToExit,
                value: this._animOgreAttackPos,

            },
            {
                frame: this._keyFramesEndAttackToExit,
                value:this._animOgreExitPos,
            }
        ]

        transfromPosition.setKeys(transfromPositionAnimKeyFrames);
        this.animations.push(transfromPosition);

        for (let i in this.animations) {
            console.log(this.animations[i].name);
        }

    }

    public async initialize():Promise<void> {
        console.log("animations at start: ", this.animations);
        //add all the models to the scene        
        for (let i = 0; i < this._importedModels.length; i++ ) {
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
        this.clickBox = await this._createModel('clickZone', 'ogreClickBox.glb');
        this.clickBox.meshes.root.parent = this;
        //hide the click zone
        const clickModelMaterial = new MatClickBox('ogreClickBoxMat', this.scene);
        this.clickBox.meshes.allMeshes[0].material = clickModelMaterial;
        this.clickBox.meshes.allMeshes[0].material.alpha = 0;

        if (this.models || this.animations.length === ogrePaths.length) {
            this.playOgreEnter();
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

    public makeUnclickable() {
        this.clickable = false;
    }

    public makeClickable() {
        this.clickable = true;
    }

    public ogreAttackMode(on:boolean) {

        if(on) {
            this.ogreAttack = true;

            if(!this._ogreInterval) {
                this._ogreInterval = setInterval(() => {
                    if(this.scene.mathState.totalFarmers > 0) {
                        this.scene.mathState.spendFarmers(1);
                    }
                },ogreIntervalTime);
            }
        } else {
            console.log('stop attack')
            this.ogreAttack = false;
            
            if (this._ogreInterval) {
                clearInterval(this._ogreInterval);
                this._ogreInterval = null;
            }
        }
        
    }

    public takeClick() {
        if (this.clicksLeft > 0) {
            this.clicksLeft -= 1;
            console.log(this.clicksLeft);
        }
    }

    public resetClicks() {
        this.clicksLeft = ogreClicks;
    }

    public playOgreEnter() {

        let randomInterval = Math.round(Math.random() * (ogreLoopMaxMin[0] - ogreLoopMaxMin[1]) + ogreLoopMaxMin[1]);

        setTimeout(async function () {

            this._scene.beginDirectAnimation(this, this.animations, this._keyFrameStartEnterToAttack, this._keyFramesEndEnterToAttack, false, 2, () =>{
                this.makeClickable();
                this.ogreAttackMode(true);
            })
        
        }.bind(this), randomInterval);
 
    }

    public playOgreExit() {
        this.makeUnclickable();
        this.ogreAttackMode(false);
        
        this._scene.beginDirectAnimation(this, this.animations, this._keyFramesStartAttackToExit, this._keyFramesEndAttackToExit, false, 2, () =>{
            this.resetClicks();
            this.playOgreEnter();
        })
      
    }
}