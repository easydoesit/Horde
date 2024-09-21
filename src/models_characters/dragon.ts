import { AbstractMesh, TransformNode, Vector3, SceneLoader, Curve3,LinesMesh, Animation } from "@babylonjs/core";
import { DEBUGMODE } from "../utils/CONSTANTS";
import { GUIPlay } from "../GUI/GUIPlay";
import { PlayMode } from "../scenes/playmode";
import { createCurve, createAnimationPath, showPath} from "../utils/animations";

import { DragonPath01} from "../utils/CONSTANTS";

export class Dragon extends TransformNode {
    public model:{root:AbstractMesh, allMeshes:AbstractMesh[]};
    private _gui:GUIPlay;
    private _animations:Animation[];
    public scene:PlayMode;

    constructor(name:string, scene:PlayMode, gui:GUIPlay){
        super(`${name}`, scene);

        this.initialize();

    }

    public async initialize():Promise<void> {
        this.model = await this.createDragon();

        this.model.root.parent = this;

        let curve:Curve3;
        let path:Vector3[];
        
        curve = await createCurve(DragonPath01);
        path = createAnimationPath(curve);

        this._makeAnimation(path,curve);
        
    }

    async createDragon():Promise<{root:AbstractMesh, allMeshes:AbstractMesh[]}>{
        const models = await SceneLoader.ImportMeshAsync('', './models/', 'dragon01.glb')
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
        const pathFollowAnim = new Animation('dragonFlight', 'position', frameRate * 1, Animation.ANIMATIONTYPE_VECTOR3);
        const pathFollowKeys = [];

        for (let i = 0; i < path.length; i++) {
            const position = path[i];

            pathFollowKeys.push({frame: i * frameRate, value:position});
        }

        pathFollowAnim.setKeys(pathFollowKeys);

        this.animations.push(pathFollowAnim);

        this._scene.beginAnimation(this, 0, frameRate * path.length, false, 1, () => {
            //this.dispose();

            if(DEBUGMODE) {
                debugPath.dispose();
            }

        })

    }
}