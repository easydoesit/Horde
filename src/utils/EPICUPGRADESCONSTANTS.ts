//Increase Add Farmers Multiplyer

export const addFarmersMultInit = 1;
export const addFarmersMultMax = 10;
export const addFarmersValueIncrement = 3;

const addFarmersBaseCostLumens = 100;

export const addFarmersCostLumens = (currentUpgradeLevel:number):number => {
    if (currentUpgradeLevel === 0 ) {
 
        return addFarmersBaseCostLumens;
 
    } else if (currentUpgradeLevel < addFarmersMultMax){
 
        return (1.6 * currentUpgradeLevel) * addFarmersBaseCostLumens;
 
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



