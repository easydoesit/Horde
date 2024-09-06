//Farmers
export const farmerBaseValue = 0.001; //base amount of gold persecond

//Wheat

export const wheatUpgradeValue = 0.05; //5%
export const wheatUpgradesMax  = 10; //multiplier of maximum improvement to wheatvalue
export const wheatUpgradeCost = (iteration:number) => {
    
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
export const farmCost = (numberOfFarms:number) => {
    const result = numberOfFarms ** numberOfFarms;

    return result;
}

//Harvest
const harvestValue = 0.08;

export const harvestSpeed = (numUpgrades:number) => {
    const result = numUpgrades * harvestValue;
}