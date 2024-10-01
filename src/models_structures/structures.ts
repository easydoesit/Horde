import { AbstractMesh, TransformNode, SceneLoader, Vector3, StandardMaterial} from "@babylonjs/core";
import { PlayMode } from "../scenes/playmode";
import { MatClickBox } from "../reusedAssets/materials";
import { modelsDir } from "../utils/CONSTANTS";

export class Structure extends TransformNode {
    public models:{name:string, meshes:{root:AbstractMesh, allMeshes:AbstractMesh[]}}[];
    private _clickBox:{name:string, meshes:{root:AbstractMesh, allMeshes:AbstractMesh[]}};
    public clickZone:AbstractMesh;

    private _modelsDir:string;
    private _importedModels:string[];
    public scene:PlayMode;

    constructor(name:string, scene:PlayMode, importedModels:string[], clickBox:string | null) {
        super(name);
        this.scene = scene;
        this._modelsDir = modelsDir;
        this._importedModels = importedModels;
        this.models = [];
        this.initialize(clickBox);
    }

    public async initialize(clickBox:string):Promise<void> {

        //add all the models to the scene        
        for (let i = 0; i <= this._importedModels.length - 1; i++ ) {
            //remove the extenstion from the filename for the name
            let name = this._importedModels[i];
            name  = name.slice(0 , -4);

            const model = await this._createModel(name,this._importedModels[i]);
            model.meshes.root.parent = this;

            this.models.push(model);
        }

        //hide the meshes of the models
        for (let i = 0; i <= this.models.length - 1; i++ ) {
            for (let j = 0; j < this.models[i].meshes.allMeshes.length; j++) {
                this.models[i].meshes.allMeshes[j].isVisible = false;
            }
        }

        //create the click model which is invisible but in the scene for RayHits
        if (clickBox) {
            this._clickBox = await this._createModel('clickZone', clickBox);
            this._clickBox.meshes.root.parent = this;
            //hide the click zone
            const clickModelMaterial = new MatClickBox(`${this.name}_clickBoxMat`, this.scene);
            this._clickBox.meshes.allMeshes[0].material = clickModelMaterial;
            this._clickBox.meshes.allMeshes[0].material.alpha = 0;

            this.clickZone = this._clickBox.meshes.allMeshes[0];
            }
    }

    async _createModel(name:string, importedModel:string):Promise<{name:string, meshes:{root:AbstractMesh, allMeshes:AbstractMesh[]}}> {
        
        const models = await SceneLoader.ImportMeshAsync('',this._modelsDir, importedModel, this.scene);
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

    public hideModel(modelN:number | string) {
    
        //if you know where in the array the model is...
        if (typeof modelN === 'number') {
            for (let i in this.models[modelN].meshes.allMeshes) {
                this.models[modelN].meshes.allMeshes[i].isVisible = false;
            }
        }
    
        //if you know the name of the model....
        if (typeof modelN === 'string') {
            const modelHide = this.models.find((model) => model.name === modelN);

            for (let i in modelHide.meshes.allMeshes) {
                modelHide.meshes.allMeshes[i].isVisible = false;
            }
        
        }

    }

    public showModel(modelN:number | string) {
        //if you know where in the array the model is...
        if (typeof modelN === 'number') {
            for (let i in this.models[modelN].meshes.allMeshes) {
                this.models[modelN].meshes.allMeshes[i].isVisible = true;
            }
        }

        //if you know the name of the model....
         if (typeof modelN === 'string') {
            const modelShow = this.models.find((model) => model.name === modelN);

            for (let i in modelShow.meshes.allMeshes) {
                modelShow.meshes.allMeshes[i].isVisible = true;
            }
        
        }


    }

}