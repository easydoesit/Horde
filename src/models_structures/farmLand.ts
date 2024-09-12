import { AbstractMesh, TransformNode, Vector3, SceneLoader} from "@babylonjs/core";
import { PlayMode } from "../scenes/playmode";

export class FarmLand extends TransformNode {
       public model:{root:AbstractMesh, allMeshes:AbstractMesh[]}
       public farmHousePos:Vector3;

    constructor(name:string, scene:PlayMode, farmHousePos:Vector3) {
        super(name, scene);
        this.position = new Vector3(0,0,0);
        this.farmHousePos = farmHousePos;

        this.initialize();

    }

    public async initialize():Promise<void>{
        this.model = await this.createFarmGround01();
        this.model.root.parent = this;

    }

    async createFarmGround01():Promise<{root:AbstractMesh, allMeshes:AbstractMesh[]}>{
        const models = await SceneLoader.ImportMeshAsync('','./models/', 'farm_land.glb', this._scene);
        const root = models.meshes[0];
        const allMeshes = root.getChildMeshes();


        return {
            root:root,
            allMeshes:allMeshes
        }
    }



}