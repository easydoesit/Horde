import {Scene } from "@babylonjs/core";
import { DEBUGMODE } from "../utils/CONSTANTS";

export default function showBabInspector(scene:Scene) {
    if (DEBUGMODE) {
        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if ((ev.metaKey || ev.ctrlKey) && ev.key === 'i') {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                } else {
                    scene.debugLayer.show({embedMode: true});
                }
            }
        });
    }
}