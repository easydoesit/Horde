import { Vector3 } from "@babylonjs/core";

export const DEBUGMODE = true;

export const GUIFONT1 = 'Arial';

export const modelsDir = './models/';

//hill
export const hillModels = ['hill.glb'];

//castle
export const castleModels = ['castle01.glb', 'castle02.glb'];
export const castlClickBox = 'castleClickBox.glb';
export const castlePos = new Vector3(-.6, 6.5, -.2);

//farms

export const farmModels = ['farm01.glb', 'farm02.glb'];
export const farmClickBox = 'farmClickBox.glb';

export const Farm01Pos = new Vector3(0,.5,-4);
export const Farm02Pos = new Vector3(0,-10,4);
export const Farm03Pos = new Vector3(0,-10,-12);
export const Farm04Pos = new Vector3(0,-10,12);

export const FarmHouse01Pos = new Vector3(-10,1.25,-4);
export const FarmHouse02Pos = new Vector3(-10,1.25,4);
export const FarmHouse03Pos = new Vector3(-10,1.25,-10);
export const FarmHouse04Pos = new Vector3(-10,1.25,10);

//mines
export const mineModels = ['mine01.glb', 'mine02.glb'];
export const mineClickBox = 'mineClickBox.glb';
export const MinePos = new Vector3(-5,1.25,1);

//smithy
export const smithyModels = ['smithy01.glb', 'smithy02.glb'];
export const smithyClickBox = 'smithyClickBox.glb';
export const smithyPos = new Vector3(-5, 5, -1.5);

//paths

export const CastleToFarmPath = [
    new Vector3(-2.8552, 6.0224, -0.29624),
    new Vector3(-2.3188, 5.3886, 0.96662),
    new Vector3(-3.7859, 2.5797, -1.9741),
    new Vector3(-4.064, 2.0743, 1.3783),
    new Vector3(-4.9398, 1.318, -0.38271),
    FarmHouse01Pos,
]

export const FarmToMinepath01 = [
    FarmHouse01Pos,
    new Vector3(FarmHouse01Pos.x + 2, 1.25, -0.38271),
    MinePos,
    
]
export const FarmToMinepath02 = [
    FarmHouse02Pos,
    new Vector3(FarmHouse02Pos.x + 2, 1.25, -0.38271),
    MinePos,
]
export const FarmToMinepath03 = [
    FarmHouse03Pos,
    new Vector3(FarmHouse03Pos.x + 2, 1.25, -0.38271),
    MinePos,
]
export const FarmToMinepath04 = [
    FarmHouse04Pos,
    new Vector3(FarmHouse04Pos.x + 2, 1.25, -0.38271),
    MinePos,
]

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
export const ogreLoopMaxMin = [5000, 1000]; //Temp Values for testing use: 5 * 60 * 1000, 1 * 60 * 1000

const ogrePathEnter = [
    new Vector3(-6,1.1, 18),
    new Vector3(-6, 1.1, 0),
    new Vector3(-6,1.1, -5),
]

const ogrePathExit = [
    new Vector3(-6,1.1, -5),
    new Vector3(-6,1.1, -18),
]

//export all the paths into array. Add as many as we want
export const ogrePaths = [ogrePathEnter, ogrePathExit];

export const ogreClicks = 10;