export type GameStateT = 'START_SCREEN' |'PLAY_MODE' | 'END_SCREEN';

export interface IStateCallback {
    setOnStateChangeCallback(callback:() => void):void;
}