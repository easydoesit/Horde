import { Vector3 } from "@babylonjs/core";
import { StructureConstantsT } from "../../typings";

export const DEBUGMODE = true;

//GUI
export const GUIFONT1 = 'Arial';

//directories
export const modelsDir = './models/';

//lumens
export const startingLumens = 1000;

//gold
export const startingGold = 5000;

//Farmers
export const startingFarmers = 4000;
export const farmerBaseValue = 0.001; //base amount of gold persecond

//Ogre
export const ogreCycleTime = 1000; //how fast the ogre ruins farmers milliseconds.
export const ogreScaresFarmers = 1; //how much the ogre removes farmers per 

//hill
export const hillModels = ['hill.glb'];

//castle
export const castleModels = ['castle01.glb', 'castle02.glb'];
export const castlClickBox = 'castleClickBox.glb';
export const castlePos = new Vector3(-.2, 7.3, .4);

/////Structures////

////////////////////////////////
///////////  Farms  ////////////
////////////////////////////////
export const farm01:StructureConstantsT = {
    name:'Farm01',
    models:['farm01.glb', 'farm02.glb'],
    clickbox:'farmClickBox.glb',
    gamePos:new Vector3(0,.5,-4),
    otherProps: {
        farmHousePos:new Vector3(-10,1.25,-4)
    },
    paths:(function() { 
            return [
            new Vector3(-2.8552, 6.0224, -0.29624),
            new Vector3(-2.3188, 5.3886, 0.96662),
            new Vector3(-3.7859, 2.5797, -1.9741),
            new Vector3(-4.064, 2.0743, 1.3783),
            new Vector3(-4.9398, 1.318, -0.38271),
            this.otherProps!.farmHousePos
        ];
    }).bind(this),
    upgradeMax:20,
    nextUpgradeCostInGold:(upgradeLevel:number) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const baseGoldCost = 10;
        const goldCostCurve = 3.4;

        let finalValue = nextUpgradeLevel * baseGoldCost * goldCostCurve;

        return finalValue
    },
    nextUpgradeCostInFarmers:null,
    nextUpgradeCostInResources:null,
    goldPerCycle:0,
    character:'farmer',
    resource:null,
};

export const farm02:StructureConstantsT = {
    name:'Farm02',
    models:['farm01.glb', 'farm02.glb'],
    clickbox:'farmClickBox.glb',
    gamePos:new Vector3(0,.5,4),
    otherProps: {
        farmHousePos:new Vector3(-10,1.25,4)
    },
    paths:(function() { 
            return [
            new Vector3(-2.8552, 6.0224, -0.29624),
            new Vector3(-2.3188, 5.3886, 0.96662),
            new Vector3(-3.7859, 2.5797, -1.9741),
            new Vector3(-4.064, 2.0743, 1.3783),
            new Vector3(-4.9398, 1.318, -0.38271),
            this.otherProps!.farmHousePos
        ];
    }).bind(this),
    upgradeMax:20,
    nextUpgradeCostInGold:(upgradeLevel:number) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const baseGoldCost = 10;
        const goldCostCurve = 3.4;

        let finalValue = nextUpgradeLevel * baseGoldCost * goldCostCurve;

        return finalValue
    },
    nextUpgradeCostInFarmers:null,
    nextUpgradeCostInResources:null,
    goldPerCycle:0,
    character:'farmer',
    resource:null,
};

export const farm03:StructureConstantsT = {
    name:'Farm03',
    models:['farm01.glb', 'farm02.glb'],
    clickbox:'farmClickBox.glb',
    gamePos:new Vector3(0,.5,-12),
    otherProps: {
        farmHousePos:new Vector3(-10,1.25,-10)
    },
    paths:(function() { 
            return [
            new Vector3(-2.8552, 6.0224, -0.29624),
            new Vector3(-2.3188, 5.3886, 0.96662),
            new Vector3(-3.7859, 2.5797, -1.9741),
            new Vector3(-4.064, 2.0743, 1.3783),
            new Vector3(-4.9398, 1.318, -0.38271),
            this.otherProps!.farmHousePos
        ];
    }).bind(this),
    upgradeMax:20,
    nextUpgradeCostInGold:(upgradeLevel:number) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const baseGoldCost = 10;
        const goldCostCurve = 3.4;

        let finalValue = nextUpgradeLevel * baseGoldCost * goldCostCurve;

        return finalValue
    },
    nextUpgradeCostInFarmers:null,
    nextUpgradeCostInResources:null,
    goldPerCycle:0,
    character:'farmer',
    resource:null,
};

export const farm04:StructureConstantsT = {
    name:'Farm04',
    models:['farm01.glb', 'farm02.glb'],
    clickbox:'farmClickBox.glb',
    gamePos:new Vector3(0,.5,12),
    otherProps: {
        farmHousePos:new Vector3(-10,1.25,10)
    },
    paths:(function() { 
            return [
            new Vector3(-2.8552, 6.0224, -0.29624),
            new Vector3(-2.3188, 5.3886, 0.96662),
            new Vector3(-3.7859, 2.5797, -1.9741),
            new Vector3(-4.064, 2.0743, 1.3783),
            new Vector3(-4.9398, 1.318, -0.38271),
            this.otherProps!.farmHousePos
        ];
    }).bind(this),
    upgradeMax:20,
    nextUpgradeCostInGold:(upgradeLevel:number) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const baseGoldCost = 10;
        const goldCostCurve = 3.4;

        let finalValue = nextUpgradeLevel * baseGoldCost * goldCostCurve;

        return finalValue
    },
    nextUpgradeCostInFarmers:null,
    nextUpgradeCostInResources:null,
    goldPerCycle:0,
    character:'farmer',
    resource:null,
};

export const farmersMaxPerFarm = (currentUpgradeAmount:number) => {

    const a = 2.35;
    const baseFarmerMultiplyer = 120;

    return currentUpgradeAmount * a * baseFarmerMultiplyer;
} 

////////////////////////////////
///////////  Mine  /////////////
////////////////////////////////
export const mine:StructureConstantsT = {
    
    name:'Mine',
    models:['mine01.glb', 'mine02.glb'],
    clickbox:'mineClickBox.glb',
    gamePos:new Vector3(-5,1.25,1),
    paths:(function () { 
        return [
            [
                farm01.otherProps.farmHousePos,
                new Vector3(farm01.otherProps.farmHousePos.x + 2, 1.25, -0.38271),
                this.gamePos,
        
            ],
            [
                farm02.otherProps.farmHousePos,
                new Vector3(farm02.otherProps.farmHousePos.x + 2, 1.25, -0.38271),
                this.gamePos,
            ],
            [
                farm03.otherProps.farmHousePos,,
                new Vector3(farm03.otherProps.farmHousePos.x + 2, 1.25, -0.38271),
                this.gamePos,
            ],
            [
                farm04.otherProps.farmHousePos,
                new Vector3(farm04.otherProps.farmHousePos.x + 2, 1.25, -0.38271),
                this.gamePos,
            ]
        ]
    }).bind(this),
    upgradeMax:20,
    nextUpgradeCostInGold:(upgradeLevel:number) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const baseGoldCost = 48;
        const goldCostCurve = 3.4;

        let finalValue = nextUpgradeLevel * baseGoldCost * goldCostCurve;

        return finalValue
    },
    nextUpgradeCostInFarmers:(upgradeLevel:number) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const initFarmerCost = 630;
        const farmerValueCurve = 4.2;

        let finalValue = nextUpgradeLevel * initFarmerCost * farmerValueCurve;

        return finalValue;
    },
    nextUpgradeCostInResources:null,
    goldPerCycle: 10, 
    character:'miner',
    resource: {
        name:'Ore',
        resourceUpgradeValue:0.05, //percent
        resourcePerCycle:4,
        initialCycleTime:5, //seconds
        resourceDependant:null,
        costOfResourceDependant:null,
        cycleTime:(upgradeLevel:number, initCycleTime:number, resourceUpgradeValue:number) => {
            let time = 1;

            const seconds = 1/initCycleTime;

            if (upgradeLevel === 0) {
                time = seconds;
            } else {
                time = seconds - (seconds * resourceUpgradeValue);
            }

            return time;
        },
        
    },
    otherProps:null,

}

////////////////////////////////
//////////// Forge /////////////
////////////////////////////////

export const forge:StructureConstantsT = {
    
    name:'Forge',
    models:['forge01.glb', 'forge02.glb'],
    clickbox:'forgeClickBox.glb',
    gamePos:new Vector3(-5, 3.5, -1.5),
    paths:(function () { 
        return [
            [
                farm01.otherProps.farmHousePos,
                new Vector3(farm01.otherProps.farmHousePos.x + 2, 1.25, -0.38271),
                this.gamePos,
                
            ],
            [
                farm02.otherProps.farmHousePos,,
                new Vector3(farm02.otherProps.farmHousePos.x + 2, 1.25, -0.38271),
                this.gamePos,
            ],
            [
                farm03.otherProps.farmHousePos,,
                new Vector3(farm03.otherProps.farmHousePos.x + 2, 1.25, -0.38271),
                this.gamePos,
            ],
            [
                farm04.otherProps.farmHousePos,
                new Vector3(farm04.otherProps.farmHousePos.x + 2, 1.25, -0.38271),
                this.gamePos,
            ]
        ]
    }).bind(this),
    upgradeMax:20,
    nextUpgradeCostInGold:(upgradeLevel:number) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const baseGoldCost = 228;
        const goldCostCurve = 5;

        let finalValue = nextUpgradeLevel * baseGoldCost * goldCostCurve;

        return finalValue
    },
    nextUpgradeCostInFarmers:(upgradeLevel:number) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const initFarmerCost = 3969;
        const farmerValueCurve = 4.2;

        let finalValue = nextUpgradeLevel * initFarmerCost * farmerValueCurve;

        return finalValue;
    },
    nextUpgradeCostInResources:(upgradeLevel) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const resourceGrowthCurve = 2.8;
        const initResourceCost = 2266;
    
        let finalValue = nextUpgradeLevel * resourceGrowthCurve * initResourceCost

        return finalValue;
    },
    goldPerCycle: 48, 
    character:'blacksmith',
    resource: {
        name:'Weapons',
        resourceUpgradeValue:0.05, //percent
        resourcePerCycle:16,
        initialCycleTime:5, //seconds'
        resourceDependant:'Ore',
        costOfResourceDependant:10,
        cycleTime:(upgradeLevel:number, initCycleTime:number, resourceUpgradeValue:number) => {
            let time = 1;

            const seconds = 1/initCycleTime;

            if (upgradeLevel === 0) {
                time = seconds;
            } else {
                time = seconds - (seconds * resourceUpgradeValue);
            }

            return time;
        },
        
    },
    otherProps:null,

}

////////////////////////////////
////////// Barracks ////////////
////////////////////////////////

export const barracks:StructureConstantsT = {
    
    name:'Barracks',
    models:['barracks01.glb', 'barracks02.glb'],
    clickbox:'barracksClickBox.glb',
    gamePos:new Vector3(-5, 1.2, - 2.25),
    paths:(function () { 
        return [
            [
                farm01.otherProps.farmHousePos,
                new Vector3(farm01.otherProps.farmHousePos.x + 2, 1.25, -0.38271),
                this.gamePos,
                
            ],
            [
                farm02.otherProps.farmHousePos,,
                new Vector3(farm02.otherProps.farmHousePos.x + 2, 1.25, -0.38271),
                this.gamePos,
            ],
            [
                farm03.otherProps.farmHousePos,,
                new Vector3(farm03.otherProps.farmHousePos.x + 2, 1.25, -0.38271),
                this.gamePos,
            ],
            [
                farm04.otherProps.farmHousePos,
                new Vector3(farm04.otherProps.farmHousePos.x + 2, 1.25, -0.38271),
                this.gamePos,
            ],
        ]
    }).bind(this),
    upgradeMax:20,
    nextUpgradeCostInGold:(upgradeLevel:number) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const baseGoldCost = 8635;
        const goldCostCurve = 5;

        let finalValue = nextUpgradeLevel * baseGoldCost * goldCostCurve;

        return finalValue
    },
    nextUpgradeCostInFarmers:(upgradeLevel:number) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const initFarmerCost = 25005;
        const farmerValueCurve = 4.2;

        let finalValue = nextUpgradeLevel * initFarmerCost * farmerValueCurve;

        return finalValue;
    },
    nextUpgradeCostInResources:(upgradeLevel) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const resourceGrowthCurve = 2.8;
        const initResourceCost = 476;
    
        let finalValue = nextUpgradeLevel * resourceGrowthCurve * initResourceCost

        return finalValue;
    },
    goldPerCycle: 160, 
    character:'soldier',
    resource: {
        name:'Villages',
        resourceUpgradeValue:0.05, //percent
        resourcePerCycle:64,
        initialCycleTime:28, //seconds'
        resourceDependant:'Weapons',
        costOfResourceDependant:100,
        cycleTime:(upgradeLevel:number, initCycleTime:number, resourceUpgradeValue:number) => {
            let time = 1;

            const seconds = 1/initCycleTime;

            if (upgradeLevel === 0) {
                time = seconds;
            } else {
                time = seconds - (seconds * resourceUpgradeValue);
            }

            return time;
        },
        
    },
    otherProps:null,

}

////////////////////////////////
//////// Thieves Guild /////////
////////////////////////////////

export const thievesGuild:StructureConstantsT = {
    
    name:'Thieves Guild',
    models:['thievesGuild01.glb', 'thievesGuild02.glb'],
    clickbox:'thievesGuildClickBox.glb',
    gamePos:new Vector3(0, 1, 5),
    paths:(function () { 
        return [
            [
                farm01.otherProps.farmHousePos,
                new Vector3(farm01.otherProps.farmHousePos.x + 2, 1.25, -0.38271),
                this.gamePos,
                
            ],
            [
                farm02.otherProps.farmHousePos,,
                new Vector3(farm02.otherProps.farmHousePos.x + 2, 1.25, -0.38271),
                this.gamePos,
            ],
            [
                farm03.otherProps.farmHousePos,,
                new Vector3(farm03.otherProps.farmHousePos.x + 2, 1.25, -0.38271),
                this.gamePos,
            ],
            [
                farm04.otherProps.farmHousePos,
                new Vector3(farm04.otherProps.farmHousePos.x + 2, 1.25, -0.38271),
                this.gamePos,
            ]
        ]
    }).bind(this),
    upgradeMax:20,
    nextUpgradeCostInGold:(upgradeLevel:number) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const baseGoldCost = 41103;
        const goldCostCurve = 5;

        let finalValue = nextUpgradeLevel * baseGoldCost * goldCostCurve;

        return finalValue
    },
    nextUpgradeCostInFarmers:(upgradeLevel:number) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const initFarmerCost = 157532;
        const farmerValueCurve = 4.2;

        let finalValue = nextUpgradeLevel * initFarmerCost * farmerValueCurve;

        return finalValue;
    },
    nextUpgradeCostInResources:(upgradeLevel) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const resourceGrowthCurve = 2.8;
        const initResourceCost = 266;
    
        let finalValue = nextUpgradeLevel * resourceGrowthCurve * initResourceCost

        return finalValue;
    },
    goldPerCycle: 640, 
    character:'thief',
    resource: {
        name:'Loot',
        resourceUpgradeValue:0.05, //percent
        resourcePerCycle:256,
        initialCycleTime:64, //seconds'
        resourceDependant:'Villages',
        costOfResourceDependant:0,
        cycleTime:(upgradeLevel:number, initCycleTime:number, resourceUpgradeValue:number) => {
            let time = 1;

            const seconds = 1/initCycleTime;

            if (upgradeLevel === 0) {
                time = seconds;
            } else {
                time = seconds - (seconds * resourceUpgradeValue);
            }

            return time;
        },
        
    },
    otherProps:null,

};

////////////////////////////////
/////////// Workshop ///////////
////////////////////////////////

export const workShop:StructureConstantsT = {
    
    name:'Workshop',
    models:['workShop01.glb', 'workShop02.glb'],
    clickbox:'workShopClickBox.glb',
    gamePos:new Vector3(-5, 4.25, 1.5),
    paths:(function () { 
        return [
            [
                farm01.otherProps.farmHousePos,
                new Vector3(farm01.otherProps.farmHousePos.x + 2, 1.25, -0.38271),
                this.gamePos,
                
            ],
            [
                farm02.otherProps.farmHousePos,,
                new Vector3(farm02.otherProps.farmHousePos.x + 2, 1.25, -0.38271),
                this.gamePos,
            ],
            [
                farm03.otherProps.farmHousePos,,
                new Vector3(farm03.otherProps.farmHousePos.x + 2, 1.25, -0.38271),
                this.gamePos,
            ],
            [
                farm04.otherProps.farmHousePos,
                new Vector3(farm04.otherProps.farmHousePos.x + 2, 1.25, -0.38271),
                this.gamePos,
            ]
        ]
    }).bind(this),
    upgradeMax:20,
    nextUpgradeCostInGold:(upgradeLevel:number) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const baseGoldCost = 195650;
        const goldCostCurve = 5;

        let finalValue = nextUpgradeLevel * baseGoldCost * goldCostCurve;

        return finalValue;
    },
    nextUpgradeCostInFarmers:(upgradeLevel:number) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const initFarmerCost = 25005;
        const farmerValueCurve = 4.2;

        let finalValue = nextUpgradeLevel * initFarmerCost * farmerValueCurve;

        return finalValue;
    },
    nextUpgradeCostInResources:(upgradeLevel) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const resourceGrowthCurve = 2.8;
        const initResourceCost = 476;
    
        let finalValue = nextUpgradeLevel * resourceGrowthCurve * initResourceCost

        return finalValue;
    },
    goldPerCycle: 2560, 
    character:'alchemist',
    resource: {
        name:'Goldbars',
        resourceUpgradeValue:0.05, //percent
        resourcePerCycle:1024,
        initialCycleTime:147, //seconds'
        resourceDependant:'Villages',
        costOfResourceDependant:0,
        cycleTime:(upgradeLevel:number, initCycleTime:number, resourceUpgradeValue:number) => {
            let time = 1;

            const seconds = 1/initCycleTime;

            if (upgradeLevel === 0) {
                time = seconds;
            } else {
                time = seconds - (seconds * resourceUpgradeValue);
            }

            return time;
        },
        
    },
    otherProps:null,

}

////////////////////////////////
//////////// Tower /////////////
////////////////////////////////

export const tower:StructureConstantsT = {
    
    name:'Tower',
    models:['tower01.glb', 'tower02.glb'],
    clickbox:'towerClickBox.glb',
    gamePos:new Vector3(-1, 6.5, -1.5),
    paths:(function () { 
        return [
            [
                farm01.otherProps.farmHousePos,
                new Vector3(farm01.otherProps.farmHousePos.x + 2, 1.25, -0.38271),
                this.gamePos,
                
            ],
            [
                farm02.otherProps.farmHousePos,,
                new Vector3(farm02.otherProps.farmHousePos.x + 2, 1.25, -0.38271),
                this.gamePos,
            ],
            [
                farm03.otherProps.farmHousePos,,
                new Vector3(farm03.otherProps.farmHousePos.x + 2, 1.25, -0.38271),
                this.gamePos,,
            ],
            [
                farm04.otherProps.farmHousePos,
                new Vector3(farm04.otherProps.farmHousePos.x + 2, 1.25, -0.38271),
                this.gamePos,
            ]
        ]
    }).bind(this),
    upgradeMax:20,
    nextUpgradeCostInGold:(upgradeLevel:number) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const baseGoldCost = 117025;
        const goldCostCurve = 5;

        let finalValue = nextUpgradeLevel * baseGoldCost * goldCostCurve;

        return finalValue;
    },
    nextUpgradeCostInFarmers:(upgradeLevel:number) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const initFarmerCost = 20480;
        const farmerValueCurve = 4.2;

        let finalValue = nextUpgradeLevel * initFarmerCost * farmerValueCurve;

        return finalValue;
    },
    nextUpgradeCostInResources:(upgradeLevel) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const resourceGrowthCurve = 2.8;
        const initResourceCost = 476;
    
        let finalValue = nextUpgradeLevel * resourceGrowthCurve * initResourceCost

        return finalValue;
    },
    goldPerCycle: 10240, 
    character:'wizard',
    resource: {
        name:'Portals',
        resourceUpgradeValue:0.05, //percent
        resourcePerCycle:4096,
        initialCycleTime:338, //seconds'
        resourceDependant:'Goldbars',
        costOfResourceDependant:476,
        cycleTime:(upgradeLevel:number, initCycleTime:number, resourceUpgradeValue:number) => {
            let time = 1;

            const seconds = 1/initCycleTime;

            if (upgradeLevel === 0) {
                time = seconds;
            } else {
                time = seconds - (seconds * resourceUpgradeValue);
            }

            return time;
        },
        
    },
    otherProps:null,

}

////////////////////////////////
//////////// Tavern ////////////
////////////////////////////////

export const tavern:StructureConstantsT = {
    
    name:'Tavern',
    models:['tavern01.glb', 'tavern02.glb'],
    clickbox:'tavernClickBox.glb',
    gamePos:new Vector3(2, 1, -5),
    paths:(function () { 
        return [
            [
                farm01.otherProps.farmHousePos,
                new Vector3(farm01.otherProps.farmHousePos.x + 2, 1.25, -0.38271),
                this.gamePos,
                
            ],
            [
                farm02.otherProps.farmHousePos,,
                new Vector3(farm02.otherProps.farmHousePos.x + 2, 1.25, -0.38271),
                this.gamePos,
            ],
            [
                farm03.otherProps.farmHousePos,,
                new Vector3(farm03.otherProps.farmHousePos.x + 2, 1.25, -0.38271),
                this.gamePos,
            ],
            [
                farm04.otherProps.farmHousePos,
                new Vector3(farm04.otherProps.farmHousePos.x + 2, 1.25, -0.38271),
                this.gamePos,
            ]
        ]
    }).bind(this),
    upgradeMax:20,
    nextUpgradeCostInGold:(upgradeLevel:number) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const baseGoldCost = 557039;
        const goldCostCurve = 5;

        let finalValue = nextUpgradeLevel * baseGoldCost * goldCostCurve;

        return finalValue;
    },
    nextUpgradeCostInFarmers:(upgradeLevel:number) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const initFarmerCost = 25005;
        const farmerValueCurve = 4.2;

        let finalValue = nextUpgradeLevel * initFarmerCost * farmerValueCurve;

        return finalValue;
    },
    nextUpgradeCostInResources:(upgradeLevel) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const resourceGrowthCurve = 2.8;
        const initResourceCost = 476;
    
        let finalValue = nextUpgradeLevel * resourceGrowthCurve * initResourceCost

        return finalValue;
    },
    goldPerCycle: 40960, 
    character:'adventurer',
    resource: {
        name:'Relics',
        resourceUpgradeValue:0.05, //percent
        resourcePerCycle:16384,
        initialCycleTime:777, //seconds'
        resourceDependant:'Portals',
        costOfResourceDependant:476,
        cycleTime:(upgradeLevel:number, initCycleTime:number, resourceUpgradeValue:number) => {
            let time = 1;

            const seconds = 1/initCycleTime;

            if (upgradeLevel === 0) {
                time = seconds;
            } else {
                time = seconds - (seconds * resourceUpgradeValue);
            }

            return time;
        },
        
    },
    otherProps:null,

}

////Characters

////////////////////////////////
//////////// Dragon ////////////
////////////////////////////////


//define dragon flight paths - Not Exported
export const dragonPath01 = [
    new Vector3(-20,6, -5),
    new Vector3(-16, 6, 0),
    new Vector3(-20,6, 5),
]

const dragonPath02 = [
    new Vector3(-20,3, 5),
    new Vector3(-16, 3, 0),
    new Vector3(-20,3, -5),
]

const dragonPath03 = [
    new Vector3(-20,8, 5),
    new Vector3(-16, 3, 0),
    new Vector3(-20,2, -5),
]

const dragonPath04 = [
    new Vector3(-20,8, 5),
    new Vector3(-16, 3, 0),
    new Vector3(-20,2, -5),
]

//export all the paths into array. Add as many as we want
export const dragonPaths = [dragonPath01, dragonPath02, dragonPath03, dragonPath04];

//a random interval for how often a dragon should appear.
export const dragonLoopMaxMin = [15000, 5000]; //milliseconds

//egg
export const eggFallPath = (dragonPosition:Vector3) => {
    
    const path = [
        dragonPosition,
        new Vector3(dragonPosition.x, -10, dragonPosition.z)
    ]
    
    return path;
}

export function eggDelivery():{option:'gold' | 'lumens', amount:number} {
    
    const gold = [100, 500, 1000, 2000];//these are temporary values and should be
    const lumens = [10, 50,100, 200];//replaced by math formulas
    const options = [gold, lumens]; 
    const option = Math.floor(Math.random() *  options.length);
    let optionName:'gold' | 'lumens' = 'gold';
    const amountIndex = Math.floor(Math.random() * options[option].length);
    let amount:number;

    if(option === 0) {
        optionName = 'gold';
        amount = options[0][amountIndex];
    } else if(option === 1 ) {
        optionName = 'lumens';
        amount = options[1][amountIndex];
    }   

    const delivery = {
        option: optionName,
        amount:amount,

    }

    if (DEBUGMODE) {
       console.log(delivery);
    }
    
    return delivery;
    
}

////////////////////////////////
///////////// Ogre /////////////
////////////////////////////////

export const ogreLoopMaxMin = [10 * 60 * 1000, 3 * 60 * 1000];

const ogrePathEnter = [
    new Vector3(-6, 0, 18),
    new Vector3(-6, 0, 0),
    new Vector3(-6, 0, -5),
]

const ogrePathExit = [
    new Vector3(-6, 0, -5),
    new Vector3(-6, 0, -18),
]

//export all the paths into array. Add as many as we want
export const ogrePaths = [ogrePathEnter, ogrePathExit];
export const ogreClicks = 10;




