import { AbstractMesh, TransformNode, SceneLoader, Vector3, StandardMaterial} from "@babylonjs/core";
import { PlayMode } from "../scenes/playmode";
import { MatClickBox } from "../reusedAssets/materials"

export class Mine extends TransformNode {
    public models:{name:string, meshes:{root:AbstractMesh, allMeshes:AbstractMesh[]}}[];
    public clickBox:{name:string, meshes:{root:AbstractMesh, allMeshes:AbstractMesh[]}};
    
    private _publicDir;
    private _importedModels:string[];
    public scene;

    //public model02:{root:AbstractMesh, allMeshes:AbstractMesh[]}
    
    constructor(name:string, scene:PlayMode) {
        super(name);
        this._publicDir = './models/';
        this._importedModels = ['mine01.glb', 'mine02.glb'];
        this.scene = scene;
        this.models = [];
        
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
        this.clickBox = await this._createModel('clickZone', 'mineClickBox.glb');
        this.clickBox.meshes.root.parent = this;
        //hide the click zone
        const clickModelMaterial = new MatClickBox('mineClickBoxMat', this.scene);
        this.clickBox.meshes.allMeshes[0].material = clickModelMaterial;
        this.clickBox.meshes.allMeshes[0].material.alpha = 0;

    }

    async _createModel(name:string, importedModel:string):Promise<{name:string, meshes:{root:AbstractMesh, allMeshes:AbstractMesh[]}}> {
        
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

}