import { Vector3 } from "@babylonjs/core";

export const DEBUGMODE = true;

export const GUIFONT1 = 'Arial';

export const modelsDir = './models/';

//hill
export const hillModels = ['hill.glb'];

//castle
export const castleModels = ['castle01.glb', 'castle02.glb'];
export const castlClickBox = 'castleClickBox.glb';
export const castlePos = new Vector3(-.2, 7.3, .4);

//farms

export const farmModels = ['farm01.glb', 'farm02.glb'];
export const farmClickBox = 'farmClickBox.glb';

export const Farm01Pos = new Vector3(0,.5,-4);
export const Farm02Pos = new Vector3(0,.5,4);
export const Farm03Pos = new Vector3(0,.5,-12);
export const Farm04Pos = new Vector3(0,.5,12);

export const farmHouse01Pos = new Vector3(-10,1.25,-4);
export const FarmHouse02Pos = new Vector3(-10,1.25,4);
export const FarmHouse03Pos = new Vector3(-10,1.25,-10);
export const FarmHouse04Pos = new Vector3(-10,1.25,10);

//mines
export const mineModels = ['mine01.glb', 'mine02.glb'];
export const mineClickBox = 'mineClickBox.glb';
export const minePos = new Vector3(-5,1.25,1);

//forge
export const forgeModels = ['forge01.glb', 'forge02.glb'];
export const forgeClickBox = 'forgeClickBox.glb';
export const forgePos = new Vector3(-5, 3.5, -1.5);

//barracks
export const barracksModels = ['barracks01.glb', 'barracks02.glb'];
export const barracksClickBox = 'barracksClickBox.glb';
export const barracksPos = new Vector3(-5, 1.2, - 2.25);

//thievesGuild
export const thievesGuildModels = ['thievesGuild01.glb', 'thievesGuild02.glb'];
export const thievesGuildClickBox = 'thievesGuildClickBox.glb';
export const thievesGuildPos = new Vector3(0, 1, 5);

//workShop
export const workShopModels = ['workShop01.glb', 'workShop02.glb'];
export const workShopClickBox = 'workShopClickBox.glb';
export const workShopPos = new Vector3(-5, 4.25, 1.5);

//tower
export const towerModels = ['tower01.glb', 'tower02.glb'];
export const towerClickBox = 'towerClickBox.glb';
export const towerPos = new Vector3(-1, 6.5, -1.5);

//tavern
export const tavernModels = ['tavern01.glb', 'tavern02.glb'];
export const tavernClickBox = 'tavernClickBox.glb';
export const tavernPos = new Vector3(2, 1, -5);

//paths

const castleToFarmPath = [
    new Vector3(-2.8552, 6.0224, -0.29624),
    new Vector3(-2.3188, 5.3886, 0.96662),
    new Vector3(-3.7859, 2.5797, -1.9741),
    new Vector3(-4.064, 2.0743, 1.3783),
    new Vector3(-4.9398, 1.318, -0.38271),
    farmHouse01Pos,
]

export const castleToFarmPaths = [castleToFarmPath];

const farmToMinePath01 = [
    farmHouse01Pos,
    new Vector3(farmHouse01Pos.x + 2, 1.25, -0.38271),
    minePos,
    
]
const farmToMinePath02 = [
    FarmHouse02Pos,
    new Vector3(FarmHouse02Pos.x + 2, 1.25, -0.38271),
    minePos,
]
const farmToMinePath03 = [
    FarmHouse03Pos,
    new Vector3(FarmHouse03Pos.x + 2, 1.25, -0.38271),
    minePos,
]
const farmToMinePath04 = [
    FarmHouse04Pos,
    new Vector3(FarmHouse04Pos.x + 2, 1.25, -0.38271),
    minePos,
]

export const farmToMinePaths = [farmToMinePath01, farmToMinePath02, farmToMinePath03, farmToMinePath04];

///
const farmToForgePath01 = [
    farmHouse01Pos,
    new Vector3(farmHouse01Pos.x + 2, 1.25, -0.38271),
    forgePos,
    
]
const farmToForgePath02 = [
    FarmHouse02Pos,
    new Vector3(FarmHouse02Pos.x + 2, 1.25, -0.38271),
    forgePos,
]
const farmToForgePath03 = [
    FarmHouse03Pos,
    new Vector3(FarmHouse03Pos.x + 2, 1.25, -0.38271),
    forgePos,
]
const farmToForgePath04 = [
    FarmHouse04Pos,
    new Vector3(FarmHouse04Pos.x + 2, 1.25, -0.38271),
    forgePos,
]

export const farmToForgePaths = [farmToForgePath01, farmToForgePath02, farmToForgePath03, farmToForgePath04];

///
const farmToBarracksPath01 = [
    farmHouse01Pos,
    new Vector3(farmHouse01Pos.x + 2, 1.25, -0.38271),
    barracksPos,
    
]
const farmToBarracksPath02 = [
    FarmHouse02Pos,
    new Vector3(FarmHouse02Pos.x + 2, 1.25, -0.38271),
    barracksPos,
]
const farmToBarracksPath03 = [
    FarmHouse03Pos,
    new Vector3(FarmHouse03Pos.x + 2, 1.25, -0.38271),
    barracksPos,
]
const farmToBarracksPath04 = [
    FarmHouse04Pos,
    new Vector3(FarmHouse04Pos.x + 2, 1.25, -0.38271),
    barracksPos,
]

export const farmToBarracksPaths = [farmToBarracksPath01, farmToBarracksPath02, farmToBarracksPath03, farmToBarracksPath04];

///
const farmToThievesGuildPath01 = [
    farmHouse01Pos,
    new Vector3(farmHouse01Pos.x + 2, 1.25, -0.38271),
    thievesGuildPos,
    
]
const farmToThievesGuildPath02 = [
    FarmHouse02Pos,
    new Vector3(FarmHouse02Pos.x + 2, 1.25, -0.38271),
    thievesGuildPos,
]
const farmToThievesGuildPath03 = [
    FarmHouse03Pos,
    new Vector3(FarmHouse03Pos.x + 2, 1.25, -0.38271),
    thievesGuildPos,
]
const farmToThievesGuildPath04 = [
    FarmHouse04Pos,
    new Vector3(FarmHouse04Pos.x + 2, 1.25, -0.38271),
    thievesGuildPos,
]

export const farmToThievesGuildPaths = [farmToThievesGuildPath01, farmToThievesGuildPath02, farmToThievesGuildPath03, farmToThievesGuildPath04];

///
const farmToWorkShopPath01 = [
    farmHouse01Pos,
    new Vector3(farmHouse01Pos.x + 2, 1.25, -0.38271),
    workShopPos,
    
]
const farmToWorkShopPath02 = [
    FarmHouse02Pos,
    new Vector3(FarmHouse02Pos.x + 2, 1.25, -0.38271),
    workShopPos,
]
const farmToWorkShopPath03 = [
    FarmHouse03Pos,
    new Vector3(FarmHouse03Pos.x + 2, 1.25, -0.38271),
    workShopPos,
]
const farmToWorkShopPath04 = [
    FarmHouse04Pos,
    new Vector3(FarmHouse04Pos.x + 2, 1.25, -0.38271),
    workShopPos,
]

export const farmToWorkShopPaths = [farmToWorkShopPath01, farmToWorkShopPath02, farmToWorkShopPath03, farmToWorkShopPath04];

///
const farmToTowerPath01 = [
    farmHouse01Pos,
    new Vector3(farmHouse01Pos.x + 2, 1.25, -0.38271),
    towerPos,
    
]
const farmToTowerPath02 = [
    FarmHouse02Pos,
    new Vector3(FarmHouse02Pos.x + 2, 1.25, -0.38271),
    towerPos,
]
const farmToTowerPath03 = [
    FarmHouse03Pos,
    new Vector3(FarmHouse03Pos.x + 2, 1.25, -0.38271),
    towerPos,
]
const farmToTowerPath04 = [
    FarmHouse04Pos,
    new Vector3(FarmHouse04Pos.x + 2, 1.25, -0.38271),
    towerPos,
]

export const farmToTowerPaths = [farmToTowerPath01, farmToTowerPath02, farmToTowerPath03, farmToTowerPath04];

///
const farmToTavernPath01 = [
    farmHouse01Pos,
    new Vector3(farmHouse01Pos.x + 2, 1.25, -0.38271),
    tavernPos,
    
]
const farmToTavernPath02 = [
    FarmHouse02Pos,
    new Vector3(FarmHouse02Pos.x + 2, 1.25, -0.38271),
    tavernPos,
]
const farmToTavernPath03 = [
    FarmHouse03Pos,
    new Vector3(FarmHouse03Pos.x + 2, 1.25, -0.38271),
    tavernPos,
]
const farmToTavernPath04 = [
    FarmHouse04Pos,
    new Vector3(FarmHouse04Pos.x + 2, 1.25, -0.38271),
    tavernPos,
]

export const farmToTavernPaths = [farmToTavernPath01, farmToTavernPath02, farmToTavernPath03, farmToTavernPath04];

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

//Ogre
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