import { AbstractMesh, TransformNode, SceneLoader} from "@babylonjs/core";
import { PlayMode } from "../scenes/playmode";

export class Castle01 extends TransformNode {
    public model:{root:AbstractMesh, allMeshes:AbstractMesh[]}

    constructor(scene:PlayMode) {
        super('castle01', scene);

        this.initialize();
        
    }

    public async initialize():Promise<void> {
        this.model = await this.createCastle();
        this.model.root.parent = this;
    }

    async createCastle():Promise<{root:AbstractMesh, allMeshes:AbstractMesh[]}> {
        const models = await SceneLoader.ImportMeshAsync('','./models/', 'castle01.glb', this._scene);
        const root = models.meshes[0];
        const allMeshes = root.getChildMeshes();

        return {
            root:root,
            allMeshes:allMeshes
        }
    }
}