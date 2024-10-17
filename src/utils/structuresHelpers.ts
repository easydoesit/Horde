export const debugUpgradeState = (name:string, upgradeLevel:number) => {
    console.log(`${name} upgradeStateCalled`);
    console.log(`${name} currentUpgradeLevel: ${upgradeLevel}`);
}