import {Scene } from "@babylonjs/core";

export default function showBabInspector(scene:Scene) {
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