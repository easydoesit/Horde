import { PlayMode } from "../../scenes/playmode";
import { EpicUpgradeSection } from "./epicUpgradeSection";
import { UpgradeWindow } from "../upgradeWindow"

export class EpicUpgradeWindow extends UpgradeWindow { 
    private _scene:PlayMode;
    private _epicUpgradeAddFarmers:EpicUpgradeSection;
    private _epicUpgradeBaseGold:EpicUpgradeSection;
    private _epicUpgradeBaseResource:EpicUpgradeSection;
    private _epicFasterCycleTime:EpicUpgradeSection;

    constructor(name:string, scene:PlayMode) {
        super(name);
        this.name = name;
        this._scene = scene;

        this.width = 0.5;
        this.height = 1;
        this.background = 'violet';

        this._epicUpgradeAddFarmers = new EpicUpgradeSection('Running Farmers', this._scene.epicAddFarmersUpgrade, this._scene, null);
        this.getPanelContainer().addControl(this._epicUpgradeAddFarmers);
        
        this._epicUpgradeBaseGold = new EpicUpgradeSection('Gold Per Structure', this._scene.epicUpgradeBaseGold, this._scene, null);
        this.getPanelContainer().addControl(this._epicUpgradeBaseGold);
        
        this._epicUpgradeBaseResource = new EpicUpgradeSection('Resource Per Structure', this._scene.epicUpgradeBaseResource, this._scene, null);
        this.getPanelContainer().addControl(this._epicUpgradeBaseResource);
        
        this._epicFasterCycleTime = new EpicUpgradeSection('Faster Cycle Time', this._scene.epicFasterCycleTimes, this._scene, null);
        this.getPanelContainer().addControl(this._epicFasterCycleTime);
    }

}