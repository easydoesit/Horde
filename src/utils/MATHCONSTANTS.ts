import { DEBUGMODE } from "./CONSTANTS";

//lumens
export const startingLumens = 100;

//gold
export const startingGold = 0;

//eggs
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

//Farmers
export const startingFarmers = 0;
export const farmerBaseValue = 0.001; //base amount of gold persecond
export const ogreIntervalTime = 1000; //how fast the ogre ruins farmers.
export const ogreScaresFarmers = 2; //how much the ogre removes farmers per ogreBeat

//Wheat

export const wheatUpgradeValue = 0.05; //5%
export const wheatUpgradesMax  = 10; //multiplier of maximum improvement to wheatvalue
export const wheatUpgradeCostGold = (iteration:number) => {
    
    // Coefficients from the quartic equation
    const a = 0.005;
    const b = -0.027;
    const c = 0.458;
    const d = 1.270;
    const e = -1.203;

    // Applying the quartic formula: y = ax^4 + bx^3 + cx^2 + dx + e
    return a * Math.pow(iteration, 4) + b * Math.pow(iteration, 3) + c * Math.pow(iteration, 2) + d * iteration + e;
}


//Farms
export const farmUpgradeMax = 5;

export const farmUpgradeCostGold = (numberOfUpgrades:number) => {
    const a = 2.01;
    const b = 4.77;
    return a * Math.exp(b * numberOfUpgrades);
}

export const farmersMaxPerFarm = (currentUpgradeAmount:number) => {

    const a = 2.35;
    const baseFarmerMultiplyer = 120;

    return currentUpgradeAmount * a * baseFarmerMultiplyer;
} 

//Mines
export const mineUpgradeMax = 3;
export const mineGoldPerCycle = 10;

export const mineUpgradeCostGold = (numberOfUpgrades:number) => {
    const a = 2.75;
    const b = 4.5;

    return a * Math.exp(b * numberOfUpgrades);
} 

export const mineUpgradeCostFarmers = (numberOfUpgrades:number) => {
    switch (numberOfUpgrades) {
        case 0: {
            return 24;
        
        }
        case 1:  {
            return 208;
        }

        case 2: {
            return 1130;
        }

        case 3: {
            return 5000;
        }
    }
}

export const ore = 0;
export const oreUpgradeValue = 0.05; //percent
export const orePerCycle = 4;
export const timeToMakeOre = (numberOfUpgrades:number) => {
    
    switch (numberOfUpgrades) {
        case 0: {
            return 0;
        
        }
        case 1:  {
            return .20;
        }

        case 2: {
            return .4;
        }

        case 3: {
            return 1;
        }
    }
}

//Forge
export const forgeUpgradeMax = 3;
export const forgeCreateGoldAmount = 10;

export const weapons = 0;
export const costOfWeaponsOre = 10;
export const weaponUpgradeValue = 0.05; //percent

export const timeToMakeWeapon = (numberOfUpgrades:number) => {
    
    switch (numberOfUpgrades) {
        case 0: {
            return 0;
        
        }
        case 1:  {
            return .25;
        }

        case 2: {
            return .4;
        }

        case 3: {
            return 1;
        }
    }
}

export const forgeUpgradeCostGold = (numberOfUpgrades:number) => {
    const a = 3.01;
    const b = 5;
    return a * Math.exp(b * numberOfUpgrades);
}

export const forgeUpgradeCostFarmers = (numberOfUpgrades:number) => {
    switch (numberOfUpgrades) {
        case 0: {
            return 2;
        
        }
        case 1:  {
            return 12;
        }

        case 2: {
            return 300;
        }

        case 3: {
            return 1300;
        }
    }
}

//Barracks
export const barracksUpgradeMax = 3;
export const barracksCreateGoldAmount = 160;
export const villages = 0;
export const costOfVillagesWeapons = 10;
export const villagesUpgradeValue = 0.05; //percent

export const timeToMakeVillage = (numberOfUpgrades:number) => {
    
    switch (numberOfUpgrades) {
        case 0: {
            return 0;
        
        }
        case 1:  {
            return .25;
        }

        case 2: {
            return .4;
        }

        case 3: {
            return 1;
        }
    }
}

export const barracksUpgradeCostGold = (numberOfUpgrades:number) => {
    const a = 3.01;
    const b = 5;
    return a * Math.exp(b * numberOfUpgrades);
}

export const barracksUpgradeCostFarmers = (numberOfUpgrades:number) => {
    switch (numberOfUpgrades) {
        case 0: {
            return 20;
        
        }
        case 1:  {
            return 75;
        }

        case 2: {
            return 600;
        }

        case 3: {
            return 2000;
        }
    }
}

//ThievesGuild
export const thievesGuildUpgradeMax = 3;
export const theivesGuildCreateGoldAmount = 640;

export const loot = 0;
export const costOfLoot = 10;
export const lootUpgradeValue = 0.05; //percent

export const timeToMakeLoot = (numberOfUpgrades:number) => {
    
    switch (numberOfUpgrades) {
        case 0: {
            return 0;
        
        }
        case 1:  {
            return .25;
        }

        case 2: {
            return .4;
        }

        case 3: {
            return 1;
        }
    }
}

export const thievesGuildUpgradeCostGold = (numberOfUpgrades:number) => {
    const a = 3.01;
    const b = 5;
    return a * Math.exp(b * numberOfUpgrades);
}

export const thievesGuildUpgradeCostFarmers = (numberOfUpgrades:number) => {
    switch (numberOfUpgrades) {
        case 0: {
            return 20;
        
        }
        case 1:  {
            return 75;
        }

        case 2: {
            return 600;
        }

        case 3: {
            return 2000;
        }
    }
}

//WorkShop
export const workShopUpgradeMax = 3;
export const workShopCreateGoldAmount = 2560

export const goldBars = 0;
export const costOfGoldBar = 10;
export const goldBarUpgradeValue = 0.05; //percent

export const timeToMakeGoldBar = (numberOfUpgrades:number) => {
    
    switch (numberOfUpgrades) {
        case 0: {
            return 0;
        
        }
        case 1:  {
            return .25;
        }

        case 2: {
            return .4;
        }

        case 3: {
            return 1;
        }
    }
}

export const workShopUpgradeCostGold = (numberOfUpgrades:number) => {
    const a = 3.01;
    const b = 5;
    return a * Math.exp(b * numberOfUpgrades);
}

export const workShopUpgradeCostFarmers = (numberOfUpgrades:number) => {
    switch (numberOfUpgrades) {
        case 0: {
            return 20;
        
        }
        case 1:  {
            return 75;
        }

        case 2: {
            return 600;
        }

        case 3: {
            return 2000;
        }
    }
}

//Tower
export const towerUpgradeMax = 3;
export const towerCreateGoldAmount = 10240;
export const portals = 0;
export const costOfPortal = 10;
export const portalUpgradeValue = 0.05; //percent

export const timeToMakePortal = (numberOfUpgrades:number) => {
    
    switch (numberOfUpgrades) {
        case 0: {
            return 0;
        
        }
        case 1:  {
            return .25;
        }

        case 2: {
            return .4;
        }

        case 3: {
            return 1;
        }
    }
}

export const towerUpgradeCostGold = (numberOfUpgrades:number) => {
    const a = 3.01;
    const b = 5;
    return a * Math.exp(b * numberOfUpgrades);
}

export const towerUpgradeCostFarmers = (numberOfUpgrades:number) => {
    switch (numberOfUpgrades) {
        case 0: {
            return 20;
        
        }
        case 1:  {
            return 75;
        }

        case 2: {
            return 600;
        }

        case 3: {
            return 2000;
        }
    }
}

//Tavern
export const tavernUpgradeMax = 3;
export const tavernCreateGoldAmount = 40960;
export const relics = 0;
export const costOfRelic = 10;
export const relicUpgradeValue = 0.05; //percent

export const timeToMakeRelic = (numberOfUpgrades:number) => {
    
    switch (numberOfUpgrades) {
        case 0: {
            return 0;
        
        }
        case 1:  {
            return .25;
        }

        case 2: {
            return .4;
        }

        case 3: {
            return 1;
        }
    }
}

export const tavernUpgradeCostGold = (numberOfUpgrades:number) => {
    const a = 3.01;
    const b = 5;
    return a * Math.exp(b * numberOfUpgrades);
}

export const tavernUpgradeCostFarmers = (numberOfUpgrades:number) => {
    switch (numberOfUpgrades) {
        case 0: {
            return 20;
        
        }
        case 1:  {
            return 75;
        }

        case 2: {
            return 600;
        }

        case 3: {
            return 2000;
        }
    }
}



