import { AbstractMesh, TransformNode, Vector3, Scene, SceneLoader } from "@babylonjs/core";

export class FarmLand01 extends TransformNode {
       public model:{root:AbstractMesh, allMeshes:AbstractMesh[]}

    constructor(scene:Scene) {
        super('FarmGround01', scene);
        this.position = new Vector3(0,0,0);

        this.initialize();

    }

    public async initialize():Promise<void>{
        this.model = await this.createFarmGround01();
        this.model.root.parent = this;

    }

    async createFarmGround01():Promise<{root:AbstractMesh, allMeshes:AbstractMesh[]}>{
        const models = await SceneLoader.ImportMeshAsync('','./models/', 'farm_land_01.glb', this._scene);
        const root = models.meshes[0];
        const allMeshes = root.getChildMeshes();


        return {
            root:root,
            allMeshes:allMeshes
        }
    }



}