import { AbstractMesh, TransformNode, SceneLoader, Vector3} from "@babylonjs/core";
import { PlayMode } from "../scenes/playmode";

export class Mine02 extends TransformNode {
    public model:{root:AbstractMesh, allMeshes:AbstractMesh[]}

    
    constructor(name:string, scene:PlayMode) {
        super(name, scene);
        
        
        this.initialize();

        

    }

    public async initialize():Promise<void> {
        this.model = await this.createMine02();
        this.model.root.parent = this;
    }

    async createMine02():Promise<{root:AbstractMesh, allMeshes:AbstractMesh[]}> {
        const models = await SceneLoader.ImportMeshAsync('','./models/', 'mine02.glb', this._scene);
        const root = models.meshes[0];
        const allMeshes = root.getChildMeshes();

        return {
            root:root,
            allMeshes:allMeshes
        }
    }
}