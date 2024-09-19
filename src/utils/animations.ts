import { Vector3, Curve3, Path3D, MeshBuilder } from "@babylonjs/core";


export async function createCurve(pointsArray:Vector3[]) {
    const catmullRom = Curve3.CreateCatmullRomSpline (pointsArray,3
    )
    return catmullRom;

}

export function showPath(curve:Curve3) {
    //DEBUG visualize the path  TODO Move out of path creation
        const mesh = MeshBuilder.CreateLines('lines', {points:curve.getPoints()});
        return mesh;
    }



export function createAnimationPath(curve:Curve3) {

    //transfrom the curves into a proper 3D path
    const actorsPath = new Path3D(curve.getPoints());
    const actorsPathCurve = actorsPath.getCurve();
    //
    return actorsPathCurve;
}
