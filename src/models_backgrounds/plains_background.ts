import { AbstractMesh, TransformNode, Vector3, Scene, SceneLoader } from "@babylonjs/core";

export class PlainsBackground extends TransformNode {
    public model:{root:AbstractMesh, allMeshes:AbstractMesh[]}

    constructor(scene:Scene) {
        super('plains_background', scene);
        this.position = new Vector3(0,0,0);

        this.initilize();

    }

    public async initilize():Promise<void>{
        this.model = await this.createPlainsBackground();
        this.model.root.parent = this;

    }

    async createPlainsBackground():Promise<{root:AbstractMesh, allMeshes:AbstractMesh[]}>{
        const models = await SceneLoader.ImportMeshAsync('','./models/', 'plains_background.glb', this._scene);
        const root = models.meshes[0];
        const allMeshes = root.getChildMeshes();


        return {
            root:root,
            allMeshes:allMeshes
        }
    }

}