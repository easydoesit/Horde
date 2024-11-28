export const wheat = {
    name:'wheat',
    structure:'Farm01',
    incrementValue: 0.15,//as percent
    upgradeMax:80,
    
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
        const baseGoldCost = 7;
        const goldCostGrowthCurve = 2.2;
    
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
        const baseGoldCost = 238;
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
        const baseGoldCost = 235;
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
        const baseGoldCost = 1070;
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

export const increaseSoldierSpeed = {
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
        const baseGoldCost = 1065;
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

export const increaseLootValue = {
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
    
        return finalValue;
    },
    nextUpgradeCostFarmers:(upgradeLevel:number) => {
        return 0;
    },
    nextUpgradeCostResources:(upgradeLevel:number) => {
        return 0;
    },
}

export const increaseLootSpeed = {
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
    
        return finalValue;
    },
    nextUpgradeCostFarmers:(upgradeLevel:number) => {
        return 0;
    },
    nextUpgradeCostResources:(upgradeLevel:number) => {
        return 0;
    },
}

export const increaseGoldBarValue = {
    name:'Increase Workshop Value',
    structure:'Workshop',
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
        const baseGoldCost = 24585;
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

export const increaseGoldBarSpeed = {
    name:'Increase Workshop Speed',
    structure:'Workshop',
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
        const baseGoldCost = 24585;
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

export const increasePortalValue = {
    name:'Increase Tower Value',
    structure:'Tower',
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
        const baseGoldCost = 117025;
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

export const increasePortalSpeed = {
    name:'Increase Tower Speed',
    structure:'Tower',
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
        const baseGoldCost = 117025;
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

export const increaseRelicValue = {
    name:'Increase Tavern Value',
    structure:'Tavern',
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
        const baseGoldCost = 557039;
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

export const increaseAdventuringSpeed = {
    name:'Increase Tavern Speed',
    structure:'Tavern',
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
        const baseGoldCost = 557039;
        const goldCostGrowthCurve = 3.4;
    
        let finalValue = baseGoldCost * goldCostGrowthCurve * nextUpgradeLevel;
    
        return finalValue;
    },
    nextUpgradeCostFarmers:(upgradeLevel:number) => {
        return 0;
    },
    nextUpgradeCostResources:(upgradeLevel:number) => {
        return 0;
    }
}