/* eslint-disable @typescript-eslint/no-unused-vars */
import v4 = require("uuid/v4");
import Player from "../server/Player";
import Game from "../server/Game";
import {SupplyData} from "../createSupplyData";
import {GainRestrictions} from "../server/GainRestrictions";
import Tracker from "../server/Tracker";

export interface Cost {
    coin: number;
}
export type ValidCardTypes = 'action' | 'treasure' | 'victory' | 'curse' | 'attack' | 'duration' | 'reaction' | 'castle' | 'doom' | 'fate' | 'gathering' | 'heirloom' | 'knight' | 'looter' | 'night' | 'prize' | 'reserve' | 'ruins' | 'shelter' | 'spirit' | 'traveller' | 'zombie' | 'project' | 'artifact';
export type CardImplementation = (typeof Card) & {new (game: Game | null): Card};
export default abstract class Card {
    id: string;
    game: Game;
    features: ReadonlyArray<'vp' | 'coffers' | 'villagers'> = [];
    isCard = true;
    static descriptionSize = 60;
    static typelineSize = 64;
    static inSupply = true;
    intrinsicValue = 0;
    static get isCard(): typeof Card['isCard'] {
        // @ts-ignore
        return new this().isCard;
    }
    static smallText = false;
    static get features(): typeof Card['features'] {
        // @ts-ignore
        return new this().features;
    }
    constructor(game: Game | null) {
        this.id = v4();
        this.game = game as Game;
    }
    randomizable = true;
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
    abstract intrinsicTypes: readonly ValidCardTypes[];
    get types() {
        return this.game ? this.game.getTypesOfCard(this.name) : this.intrinsicTypes;
    }
    static get types(): Card['types'] {
        if (this === Card) {
            throw new Error("types are only available on implemented cards.");
        }
        // @ts-ignore
        return new this().intrinsicTypes;
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
    public static createSupplyPiles(playerCount: number, game: Game): Array<{identifier: string; pile: Card[]; identity: Card; displayCount: boolean; hideCost?: boolean; inSupply?: boolean}> {
        const pile: Card[] = [];
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
            displayCount: true,
            inSupply: this.inSupply
        }];
    }

    public static setup(globalCardData: any, game: Game) {

    }

    /**
     * Use this function to determine your dependant piles. For example, you might add 'ruins' here, but not 'ruined library'.
     * This has a default implementation to use if, for example, you have the type of 'looter', so make sure to call `super.onChosen()`.
     */
    public static onChosen(): string[] {
        const def = [] as string[];
        if (this.types.includes("looter")) {
            def.push("ruins");
        }
        return def;
    }

    /**
     * Use this function to lay out the cards you use in this pile. For example, 'ruins' would add 'ruined library', 'ruined village', etc.
     */
    public static registerOtherCards(): string[] {
        return [];
    }

    public static getExtraRestrictions(cardData: any, player: Player, restrictions: GainRestrictions): GainRestrictions {
        throw new Error("Not implemented");
    }

    public static getCostModifier(cardData: any, game: Game, activatedCards: string[]): {[card: string]: Cost} | null {
        return null;
    }

    public static getTypeModifier(cardData: any, game: Game, activatedCards: string[]): {[card: string]: {toRemove: ValidCardTypes[]; toAdd: ValidCardTypes[]}} | null {
        return null;
    }

    public static getSupplyMarkers(cardData: any, piles: SupplyData['piles']): {[card: string]: string[]} | null {
        return null;
    }
    public async doTreasure(player: Player, tracker: Tracker<this>) {
        return await this.onTreasure(player, tracker);
    }
    public static onScore(player: Player): number {
        return 0;
    }
    public shouldDiscardFromPlay() {
        return true;
    }
    private trackers: Array<Tracker<Card>> = [];
    public addTracker(tracker: Tracker<Card>) {
        this.trackers.push(tracker);
    }
    public loseTrack() {
        this.trackers.forEach((t) => t.loseTrack());
        this.trackers = [];
    }
    public async onDiscardFromPlay(player: Player, tracker: Tracker<Card>) {

    }
    public async onAction(player: Player, exemptPlayers: Player[], tracker: Tracker<this>) {
        await player.events.emit('noActionImpl', this, exemptPlayers);
    }
    public async onAttackInHand(player: Player, attacker: Player, attackingCard: Card, playerAlreadyExempt: boolean): Promise<boolean> {
        return false;
    }
    public static async onBuy(player: Player): Promise<Card | null> {
        await player.game.events.emit('buy', player, this.cardName);
        await player.events.emit('buy', this.cardName);
        return await player.gain(this.cardName, undefined, false);
    }
    public onGainSelf(player: Player, tracker: Tracker<this>): Promise<void> | void {

    }
    public onTrashSelf(player: Player, tracker: Tracker<this>): Promise<void> | void {

    }
    public onRevealSelf(player: Player, tracker: Tracker<this>): Promise<void> | void {

    }
    protected async onTreasure(player: Player, tracker: Tracker<this>) {
        await player.events.emit('noTreasureImpl', this);
    }
    protected getGlobalData() {
        return (this.game || {supply: {data: {globalCardData: {[this.name]: {}}}}}).supply.data.globalCardData[this.name];
    }
    // noinspection JSUnusedGlobalSymbols
    toJSON() {
        const {id, name, types} = this;
        return {id, name, types};
    }
}