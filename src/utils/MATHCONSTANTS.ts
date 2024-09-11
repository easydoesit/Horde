//gold
export const startingGold = 800;

//Farmers
export const startingFarmers = 260;
export const farmerBaseValue = 0.001; //base amount of gold persecond

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

export const farmCost = 27.71;

export const farmUpgradeCost = (numberOfUpgrades:number) => {
    const a = 2.01;
    const b = 4.77;
    return a * Math.exp(b * numberOfUpgrades);
}

export const farmersMax = (currentFarmUpgradeAmount:number) => {
    const a = 2.35;
    const baseFarmerMultiplyer = 120;

    return currentFarmUpgradeAmount * a * baseFarmerMultiplyer;
} 