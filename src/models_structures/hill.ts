import { AbstractMesh, TransformNode, Vector3, Scene, SceneLoader } from "@babylonjs/core";

export class Hill extends TransformNode {
    public model:{root:AbstractMesh, allMeshes:AbstractMesh[]}

    constructor(scene:Scene) {
        super('hill', scene);
        this.position = new Vector3(0,0,0);

        this.initialize();

    }

    public async initialize():Promise<void>{
        this.model = await this.createHill();
        this.model.root.parent = this;

    }

    async createHill():Promise<{root:AbstractMesh, allMeshes:AbstractMesh[]}>{
        const models = await SceneLoader.ImportMeshAsync('','./models/', 'hill.glb', this._scene);
        const root = models.meshes[0];
        const allMeshes = root.getChildMeshes();


        return {
            root:root,
            allMeshes:allMeshes
        }
    }

}