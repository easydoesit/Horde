import { UpgradeWindow } from "./upgradeWindow"

export class EpicUpgradeWindow extends UpgradeWindow {

    constructor(name:string) {
        super(name);

        this.width = 0.5;
        this.height = 1;
        this.background = 'violet';

    }

}