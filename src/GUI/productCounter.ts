import {Control, TextBlock, Rectangle } from "@babylonjs/gui";
import { GUIFONT1 } from "../utils/CONSTANTS";
import { GUIProductCounterI } from "../../typings";

export class ProductCounter implements GUIProductCounterI {
    private _fullWrapper:Rectangle;
    private _counterWrapper:Rectangle;
    private _titleWrapper:Rectangle;
    
    public counterBlock:TextBlock;
    private _titleBlock:TextBlock;

    constructor(title:string, top:string | number, left:string | number, startCount:string, wrapper:Rectangle) {
        this._fullWrapper = new Rectangle(`${title}_FullWrapper`);
        this._fullWrapper.top = top
        this._fullWrapper.left = left;
        this._fullWrapper.width = .2;
        this._fullWrapper.height = .25;
        this._fullWrapper.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this._fullWrapper.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        this._fullWrapper.thickness = 0;

        wrapper.addControl(this._fullWrapper);
        
        this._counterWrapper = new Rectangle(`${title}_CounterWrapper`);
        this._counterWrapper.left = 0;
        this._counterWrapper.width = .35;
        this._counterWrapper.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this._counterWrapper.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._counterWrapper.thickness = 0;

        this._fullWrapper.addControl(this._counterWrapper);

        this.counterBlock = new TextBlock(`${title}_CounterText`);
        this.counterBlock.text = startCount;
        this.counterBlock.color = 'white';
        this.counterBlock.fontFamily = GUIFONT1;
        this.counterBlock.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.counterBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;

        this._counterWrapper.addControl(this.counterBlock);

        this._titleWrapper = new Rectangle(`${title}_TitleWrapper`);
        this._titleWrapper.left = 122;
        this._titleWrapper.width = .6;
        this._titleWrapper.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this._titleWrapper.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._titleWrapper.thickness = 0;

        this._fullWrapper.addControl(this._titleWrapper);

        this._titleBlock = new TextBlock(`${title}_titleText`);
        this._titleBlock.text = title;
        this._titleBlock.color = 'white';
        this._titleBlock.fontFamily = GUIFONT1;
        this._titleBlock.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this._titleBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

        this._titleWrapper.addControl(this._titleBlock);
    }

    public changeText(string:string) {
        this.counterBlock.text = string;
    }

}