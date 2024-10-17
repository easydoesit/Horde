//Increase Add Farmers Multiplyer

export const addFarmersStartValue = 1;
export const addFarmersNumUpgradeMax = 10;
export const addFarmersValueIncrement = 3;

export const addFarmersBaseCostLumens = 100;

export const addFarmersCostLumens = (currentUpgradeLevel:number, upgradeMax:number, baseCostLumens:number):number => {
    
    if (currentUpgradeLevel === 0 ) {
 
        return baseCostLumens;
 
    } else if (currentUpgradeLevel < upgradeMax){
 
        return (1.6 * currentUpgradeLevel) * baseCostLumens;
 
    }

}

export const addFarmersUpgradeInstructions = (upgradeLevel:number, increment:number):string => {
    let value = 0;
    if (upgradeLevel === 0) {
        value = 1
    } else {
        value = upgradeLevel * increment;
    }

    return `Current upgrade adds ${value} farmers per click`

}

//Base Gold Percent


export const baseGoldPercentStart = 0; //initialValue
export const baseGoldPercentUpgradeMax = 10; //maxNumbUpgrades
export const baseGoldPercentValueIncrement = 1.005; //valueIncrement

export const baseGoldPercentBaseCostLumens = 200; //baseCostLumens

//costIncreaseFunction
export const baseGoldPercentCostLumens = (currentUpgradeLevel:number, upgradeMax:number, baseCostLumens:number):number => {
    
    if (currentUpgradeLevel === 0) {
        
        return baseCostLumens;

    } else if (currentUpgradeLevel < upgradeMax) {

        return (2.2 * currentUpgradeLevel) * baseCostLumens;
    
    }

}

//instructions
export const baseGoldPercentInstructions = (upgradeLevel:number, increment:number):string => {
    let value = 0;

    if (upgradeLevel === 0 ) {
        value = 0;
    } else {
        value = upgradeLevel * increment
    }

    return `Current upgrade adds ${value} of gold to all structures`;
}

