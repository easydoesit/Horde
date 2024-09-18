import { Vector3 } from "@babylonjs/core";

export const DEBUGMODE = true;

export const GUIFONT1 = 'Arial';

export const FarmHouse01Pos = new Vector3(-10,1.25,-4);
export const FarmHouse02Pos = new Vector3(-10,1.25,4);
export const FarmHouse03Pos = new Vector3(-10,1.25,-10);
export const FarmHouse04Pos = new Vector3(-10,1.25,10);

export const MinePos = new Vector3(-5,1.25,1);

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