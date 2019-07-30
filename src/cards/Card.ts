/* eslint-disable @typescript-eslint/no-unused-vars */
import v4 = require("uuid/v4");
import Player from "../server/Player";
import Game from "../server/Game";

export interface Cost {
    coin: number;
}
type ValidCardTypes = 'action' | 'treasure' | 'victory' | 'curse' | 'attack' | 'duration' | 'reaction' | 'castle' | 'doom' | 'fate' | 'gathering' | 'heirloom' | 'knight' | 'looter' | 'night' | 'prize' | 'reserve' | 'ruins' | 'shelter' | 'spirit' | 'traveller' | 'zombie';
export default abstract class Card {
    id: string;
    game: Game;
    features: ReadonlyArray<'vp'> = [];
    static get features(): typeof Card['features'] {
        // @ts-ignore
        return new this().features;
    }
    constructor(game: Game | null) {
        this.id = v4();
        this.game = game as Game;
    }
    randomizable: boolean = true;
    static get randomizable(): boolean {
        // @ts-ignore
        return new this().randomizable;
    }
    abstract cardText: string;
    static get cardText(): string {
        if (this === Card) {
            throw new Error("cardText is only available on implemented cards.");
        }
        // @ts-ignore
        return new this().cardText;
    }
    abstract cost: Cost;
    static get cost(): Cost {
        if (this === Card) {
            throw new Error("cost is only available on implemented cards.");
        }
        // @ts-ignore
        return new this().cost;
    }
    abstract types: readonly ValidCardTypes[];
    static get types(): Card['types'] {
        if (this === Card) {
            throw new Error("types are only available on implemented cards.");
        }
        // @ts-ignore
        return new this().types;
    }
    abstract name: string;
    static get cardName(): string {
        if (this === Card) {
            throw new Error("cardName is only available on implemented cards.");
        }
        // @ts-ignore
        return new this().name;
    }
    abstract supplyCount: number | ((playerCount: number) => number);
    public static get supplyCount() {
        // @ts-ignore
        return new this().supplyCount;
    }
    abstract cardArt: string;
    public static get cardArt() {
        // @ts-ignore
        return new this().cardArt;
    }
    public static createSupplyPiles(playerCount: number, game: Game): Array<{identifier: string; pile: Card[]; identity: Card; displayCount: boolean}> {
        let pile: Card[] = [];
        const supplyCount = typeof this.supplyCount === 'function' ? this.supplyCount(playerCount) : this.supplyCount;
        for (let i = 0; i < supplyCount; i++) {
            // @ts-ignore
            pile.push(new this(game));
        }
        return [{
            pile,
            identifier: this.cardName,
            // @ts-ignore
            identity: new this(game),
            displayCount: true
        }];
    }

    /**
     * Use this function to determine your dependant piles. For example, you might add 'ruins' here, but not 'ruined library'.
     * This has a default implementation to use if, for example, you have the type of 'looter', so make sure to call `super.onChosen()`.
     */
    public onChosen() {

    }

    /**
     * Use this function to lay out the cards you use in this pile. For example, 'ruins' would add 'ruined library', 'ruined village', etc.
     */
    public registerOtherCards() {

    }
    public async doTreasure(player: Player) {
        return await this.onTreasure(player);
    }
    public static onScore(player: Player): number {
        return 0;
    }
    public shouldDiscardFromPlay() {
        return true;
    }
    public async onDiscardFromPlay(player: Player) {

    }
    public async onAction(player: Player, exemptPlayers: Player[]) {
        throw new Error("onAction not implemented");
    }
    public async onAttackInHand(player: Player, attacker: Player, attackingCard: Card, playerAlreadyExempt: boolean): Promise<boolean> {
        return false;
    }
    protected async onTreasure(player: Player) {
        throw new Error("onTreasure not implemented");
    }
    // noinspection JSUnusedGlobalSymbols
    toJSON() {
        let {id, name} = this;
        return {id, name};
    }
}