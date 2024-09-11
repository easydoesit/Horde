import { AbstractMesh, TransformNode, Vector3, SceneLoader} from "@babylonjs/core";
import { PlayMode } from "../scenes/playmode";

export class FarmHouse extends TransformNode {
    public model:{root:AbstractMesh, allMeshes:AbstractMesh[]}

    constructor(name:string, scene:PlayMode) {
        super(name, scene);

        this.initialize();

    }

    public async initialize():Promise<void> {
        this.model = await this.createFarmHouse();
        this.model.root.parent = this;
    }

    async createFarmHouse():Promise<{root:AbstractMesh, allMeshes:AbstractMesh[]}> {
        const models = await SceneLoader.ImportMeshAsync('','./models/', 'farm_house.glb', this._scene);
        const root = models.meshes[0];
        const allMeshes = root.getChildMeshes();


        return {
            root:root,
            allMeshes:allMeshes
        }
    }
}