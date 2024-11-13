export const wheat = {
    name:'wheat',
    structure:'Farm01',
    incrementValue: 0.05,//as percent
    upgradeMax:20,
    
    effectValue: (upgradeLevel:number, upgradeMax:number, incrementalValue:number) => {
    
        if (upgradeLevel === 0) {
            return 0;
        }

        const logTarget = 1;
        const currentLevel = upgradeLevel;
        const upgradeLimit = upgradeMax; 
        const curveBalance = 5; 
        const incrementValue = incrementalValue;

        return logTarget * (Math.log(currentLevel)/Math.log(upgradeLimit)/curveBalance) + incrementValue;
        
    },
    
    nextUpgradeCostGold: (upgradeLevel:number) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const baseGoldCost = 10;
        const goldCostGrowthCurve = 3.4;
    
        let finalValue = baseGoldCost * goldCostGrowthCurve * nextUpgradeLevel;
    
        return finalValue
    },
    nextUpgradeCostFarmers:(upgradeLevel:number) => {
        return 0;
    },
    nextUpgradeCostResources:(upgradeLevel:number) => {
        return 0;
    },
}

export const increaseOreValue = {
    name:'Increase Ore Value',
    structure:'Mine',
    incrementValue:0.05,
    upgradeMax:20,

    effectValue: (upgradeLevel:number, upgradeMax:number, incrementalValue:number) => {
    
        if (upgradeLevel === 0) {
            return 0;
        }

        const logTarget = 1;
        const currentLevel = upgradeLevel;
        const upgradeLimit = upgradeMax; 
        const curveBalance = 5; 
        const incrementValue = incrementalValue;

        return logTarget * (Math.log(currentLevel)/Math.log(upgradeLimit)/curveBalance) + incrementValue;
        
    },

    nextUpgradeCostGold: (upgradeLevel:number) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const baseGoldCost = 48;
        const goldCostGrowthCurve = 3.4;
    
        let finalValue = baseGoldCost * goldCostGrowthCurve * nextUpgradeLevel;
    
        return finalValue;
    },
    nextUpgradeCostFarmers:(upgradeLevel:number) => {
        return 0;
    },
    nextUpgradeCostResources:(upgradeLevel:number) => {
        return 0;
    },

}

export const increaseMiningSpeed = {
    name:'Increase Mining Speed',
    structure:'Mine',
    incrementValue:0.05,
    upgradeMax:20,

    effectValue: (upgradeLevel:number, upgradeMax:number, incrementalValue:number) => {
    
        if (upgradeLevel === 0) {
            return 0;
        }

        const logTarget = 1;
        const currentLevel = upgradeLevel;
        const upgradeLimit = upgradeMax; 
        const curveBalance = 5; 
        const incrementValue = incrementalValue;

        return logTarget * (Math.log(currentLevel)/Math.log(upgradeLimit)/curveBalance) + incrementValue;
        
    },

    nextUpgradeCostGold: (upgradeLevel:number) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const baseGoldCost = 48;
        const goldCostGrowthCurve = 3.4;
    
        let finalValue = baseGoldCost * goldCostGrowthCurve * nextUpgradeLevel;
    
        return finalValue;
    },
    nextUpgradeCostFarmers:(upgradeLevel:number) => {
        return 0;
    },
    nextUpgradeCostResources:(upgradeLevel:number) => {
        return 0;
    },

}

export const increaseWeaponsValue = {
    name:'Increase Weapons Value',
    structure:'Forge',
    incrementValue:0.05,
    upgradeMax:20,

    effectValue: (upgradeLevel:number, upgradeMax:number, incrementalValue:number) => {
    
        if (upgradeLevel === 0) {
            return 0;
        }

        const logTarget = 1;
        const currentLevel = upgradeLevel;
        const upgradeLimit = upgradeMax; 
        const curveBalance = 5; 
        const incrementValue = incrementalValue;

        return logTarget * (Math.log(currentLevel)/Math.log(upgradeLimit)/curveBalance) + incrementValue;
        
    },

    nextUpgradeCostGold: (upgradeLevel:number) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const baseGoldCost = 228;
        const goldCostGrowthCurve = 3.4;
    
        let finalValue = baseGoldCost * goldCostGrowthCurve * nextUpgradeLevel;
        console.log('final value:',finalValue);
    
        return finalValue;
    },
    nextUpgradeCostFarmers:(upgradeLevel:number) => {
        return 0;
    },
    nextUpgradeCostResources:(upgradeLevel:number) => {
        return 0;
    },

}

export const increaseForgeSpeed = {
    name:'Increase Forge Speed',
    structure:'Forge',
    incrementValue:0.05,
    upgradeMax:20,

    effectValue: (upgradeLevel:number, upgradeMax:number, incrementalValue:number) => {
    
        if (upgradeLevel === 0) {
            return 0;
        }

        const logTarget = 1;
        const currentLevel = upgradeLevel;
        const upgradeLimit = upgradeMax; 
        const curveBalance = 5; 
        const incrementValue = incrementalValue;

        return logTarget * (Math.log(currentLevel)/Math.log(upgradeLimit)/curveBalance) + incrementValue;
        
    },

    nextUpgradeCostGold: (upgradeLevel:number) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const baseGoldCost = 228;
        const goldCostGrowthCurve = 3.4;
    
        let finalValue = baseGoldCost * goldCostGrowthCurve * nextUpgradeLevel;
        console.log('final value:',finalValue);
    
        return finalValue;
    },
    nextUpgradeCostFarmers:(upgradeLevel:number) => {
        return 0;
    },
    nextUpgradeCostResources:(upgradeLevel:number) => {
        return 0;
    },
}

export const increaseVillageValue = {
    name:'Increase Village Value',
    structure:'Barracks',
    incrementValue:0.05,
    upgradeMax:20,

    effectValue: (upgradeLevel:number, upgradeMax:number, incrementalValue:number) => {
    
        if (upgradeLevel === 0) {
            return 0;
        }

        const logTarget = 1;
        const currentLevel = upgradeLevel;
        const upgradeLimit = upgradeMax; 
        const curveBalance = 5; 
        const incrementValue = incrementalValue;

        return logTarget * (Math.log(currentLevel)/Math.log(upgradeLimit)/curveBalance) + incrementValue;
        
    },

    nextUpgradeCostGold: (upgradeLevel:number) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const baseGoldCost = 1085;
        const goldCostGrowthCurve = 3.4;
    
        let finalValue = baseGoldCost * goldCostGrowthCurve * nextUpgradeLevel;
        console.log('final value:',finalValue);
    
        return finalValue;
    },
    nextUpgradeCostFarmers:(upgradeLevel:number) => {
        return 0;
    },
    nextUpgradeCostResources:(upgradeLevel:number) => {
        return 0;
    },
}

export const increaseBarracksSpeed = {
    name:'Increase Barracks Speed',
    structure:'Barracks',
    incrementValue:0.05,
    upgradeMax:20,

    effectValue: (upgradeLevel:number, upgradeMax:number, incrementalValue:number) => {
    
        if (upgradeLevel === 0) {
            return 0;
        }

        const logTarget = 1;
        const currentLevel = upgradeLevel;
        const upgradeLimit = upgradeMax; 
        const curveBalance = 5; 
        const incrementValue = incrementalValue;

        return logTarget * (Math.log(currentLevel)/Math.log(upgradeLimit)/curveBalance) + incrementValue;
        
    },

    nextUpgradeCostGold: (upgradeLevel:number) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const baseGoldCost = 1085;
        const goldCostGrowthCurve = 3.4;
    
        let finalValue = baseGoldCost * goldCostGrowthCurve * nextUpgradeLevel;
        console.log('final value:',finalValue);
    
        return finalValue;
    },
    nextUpgradeCostFarmers:(upgradeLevel:number) => {
        return 0;
    },
    nextUpgradeCostResources:(upgradeLevel:number) => {
        return 0;
    },
}

export const increaseThievesValue = {
    name:'Increase Thieves Guild Value',
    structure:'Thieves Guild',
    incrementValue:0.05,
    upgradeMax:20,

    effectValue: (upgradeLevel:number, upgradeMax:number, incrementalValue:number) => {
    
        if (upgradeLevel === 0) {
            return 0;
        }

        const logTarget = 1;
        const currentLevel = upgradeLevel;
        const upgradeLimit = upgradeMax; 
        const curveBalance = 5; 
        const incrementValue = incrementalValue;

        return logTarget * (Math.log(currentLevel)/Math.log(upgradeLimit)/curveBalance) + incrementValue;
        
    },

    nextUpgradeCostGold: (upgradeLevel:number) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const baseGoldCost = 5165;
        const goldCostGrowthCurve = 3.4;
    
        let finalValue = baseGoldCost * goldCostGrowthCurve * nextUpgradeLevel;
        console.log('final value:',finalValue);
    
        return finalValue;
    },
    nextUpgradeCostFarmers:(upgradeLevel:number) => {
        return 0;
    },
    nextUpgradeCostResources:(upgradeLevel:number) => {
        return 0;
    },
}

export const increaseThievesSpeed = {
    name:'Increase Thieves Guild Speed',
    structure:'Thieves Guild',
    incrementValue:0.05,
    upgradeMax:20,

    effectValue: (upgradeLevel:number, upgradeMax:number, incrementalValue:number) => {
    
        if (upgradeLevel === 0) {
            return 0;
        }

        const logTarget = 1;
        const currentLevel = upgradeLevel;
        const upgradeLimit = upgradeMax; 
        const curveBalance = 5; 
        const incrementValue = incrementalValue;

        return logTarget * (Math.log(currentLevel)/Math.log(upgradeLimit)/curveBalance) + incrementValue;
        
    },

    nextUpgradeCostGold: (upgradeLevel:number) => {
        const nextUpgradeLevel = upgradeLevel + 1;
        const baseGoldCost = 5165;
        const goldCostGrowthCurve = 3.4;
    
        let finalValue = baseGoldCost * goldCostGrowthCurve * nextUpgradeLevel;
        console.log('final value:',finalValue);
    
        return finalValue;
    },
    nextUpgradeCostFarmers:(upgradeLevel:number) => {
        return 0;
    },
    nextUpgradeCostResources:(upgradeLevel:number) => {
        return 0;
    },
}