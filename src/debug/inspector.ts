import {Scene } from "@babylonjs/core";
import { DEBUGMODE } from "../utils/CONSTANTS";

export class BabInspector {
    public scene:Scene

    constructor(scene:Scene) {
        this.scene = scene;

        if (DEBUGMODE) {
            // hide/show the Inspector
            window.addEventListener("keydown", (ev) => {
                // Shift+Ctrl+Alt+I
                if ((ev.metaKey || ev.ctrlKey) && ev.key === 'i') {
                    if (this.scene.debugLayer.isVisible()) {
                        this.scene.debugLayer.hide();
                    } else {
                        this.scene.debugLayer.show({embedMode: true});
                    }
                }
            });
        }

    }

   
}