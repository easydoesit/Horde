//Increase Add Farmers Multiplyer

export const addFarmersMultInit = 1;
export const addFarmersMultMax = 10;
export const addFarmersValueIncrease = 3;

const addFarmersBaseCostLumens = 100;
export const createFarmersCostGold  = 0;

export const addFarmersCostLumens = (currentUpgradeLevel:number) => {
    if (currentUpgradeLevel === 0 ) {
 
        return addFarmersBaseCostLumens;
 
    } else if (currentUpgradeLevel < addFarmersMultMax){
 
        return (1.6 * currentUpgradeLevel) * addFarmersBaseCostLumens;
 
    }

}



