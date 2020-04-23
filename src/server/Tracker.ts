import type Card from "../cards/Card";

export default class Tracker<T extends Card> {
    private _hasTrack = true;
    get hasTrack() {
        return (!this.canExecute || this.canExecute()) && this._hasTrack;
    }
    private readonly card: T;
    constructor(card: T) {
        this.card = card;
        card.addTracker(this);
    }
    loseTrack() {
        this._hasTrack = false;
    }
    exercise(): T | null {
        if ((!this.canExecute || this.canExecute()) && this._hasTrack) {
            this.card.loseTrack();
            this.onExecute?.();
            return this.card;
        }
        return null;
    }
    viewCard(): T {
        return this.card;
    }
    private onExecute: (() => any) | null = null;
    onExercise(cb: () => any) {
        this.onExecute = cb;
    }
    private canExecute: (() => boolean) | null = null;
    canExercise(cb: () => boolean) {
        this.canExecute = cb;
    }
}