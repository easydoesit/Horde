export default function createCanvas():HTMLCanvasElement {
        //create the canvas html element and attach it to the webpage
        const canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "auto";
        canvas.id = "gameCanvas";
        const canvasPlacement = document.getElementsByClassName('canvasWrapper');
        canvasPlacement[0].appendChild(canvas);
    
    return canvas
}