import { AbstractMesh, DirectionalLight, SceneLoader, Vector3 } from "@babylonjs/core";
import { DEBUGMODE, kingSwamp } from "../utils/CONSTANTS";
import { Kingdom } from "./kingdom";
import { PlayMode } from "../scenes/playmode";

export class KingdomSwamp extends Kingdom {
    private _mainLight:DirectionalLight;

    constructor(scene:PlayMode) {
        super (kingSwamp.name, scene);
        this._name = kingSwamp.name;

        this._level = kingSwamp.level;
        
        this._baseGoldBoost = kingSwamp.baseGoldBoost;
        this._baseResourceBoost = kingSwamp.baseResourceBoost;
     
        this._costToUnlockGold = kingSwamp.costToUnlockGold;
        this._costToUnlockFarmers = kingSwamp.costToUnlockFarmers;
        this._costToUnlockResources = kingSwamp.costToUnlockResources;
        this._importedModels = kingSwamp.importedModels;

        this._prestigeLumens = kingSwamp.prestigeLumens;
        
        //make sure this initial position is below the map.
        this._models = [];
        this._hiddenPos = new Vector3(0, -1000, 0);
        const hiddenPos = this._hiddenPos;
        this.position = hiddenPos;

        //all scene environment can go here.
        //the should all start off
        this._mainLight = new DirectionalLight('mainLight', new Vector3(1,-1,1),this._scene);
        this._mainLight.intensity = 0;
        this._mainLight.parent = this;

        this.initialize().then(() => {
            this.setEnabled(false);
        });
        
    }

    public async initialize():Promise<void> {
        if (DEBUGMODE) {
            console.log(`initializing kingdom: ${this.getName()}`);
        }

        for (let i = 0; i <= this._importedModels.length  - 1; i++) {
            const modelFileName = this._importedModels[i];

            let name = modelFileName;
            name = name.slice(0,4);

            const model = await this._createModel(name, modelFileName);
            model.meshes.root.parent = this;

            this._models.push(model);

        }

    }

    private async _createModel(name:string, importedModel:string):Promise<{name:string, meshes:{root:AbstractMesh, allMeshes:AbstractMesh[]}}> {

        const models = await SceneLoader.ImportMeshAsync('', this._modeldirectory, importedModel, this._scene);
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

    public setEnabled(value: boolean): void {
        switch (value) {
            case true: {
                this.isEnabled(value);
                this._mainLight.intensity = 2;
                this.position = Vector3.Zero();
            }
            break;

            case false:
                this.isEnabled(false);
                this._mainLight.intensity = 0;
                const hiddenPos = this._hiddenPos;
                this.position = hiddenPos;
            
        }

    }

}