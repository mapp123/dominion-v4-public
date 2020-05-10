/* eslint-disable @typescript-eslint/no-unused-vars */
import v4 = require("uuid/v4");
import type Player from "../server/Player";
import type Game from "../server/Game";
import type {SupplyData} from "../createSupplyData";
import type {GainRestrictions} from "../server/GainRestrictions";
import type Tracker from "../server/Tracker";
import Cost from "../server/Cost";
import type {Effect, EffectDef} from "../server/PlayerEffects";
import {Texts} from "../server/Texts";

export type ValidCardTypes = 'action' | 'treasure' | 'victory' | 'curse' | 'attack' | 'duration' | 'reaction' | 'castle' | 'doom' | 'fate' | 'gathering' | 'heirloom' | 'knight' | 'looter' | 'night' | 'prize' | 'reserve' | 'ruins' | 'shelter' | 'spirit' | 'traveller' | 'zombie' | 'project' | 'artifact' | 'command' | 'event' | 'way';
export type CardImplementation = (typeof Card) & {new (game: Game | null): Card};
export default abstract class Card {
    id: string;
    game: Game;
    features: ReadonlyArray<'vp' | 'coffers' | 'villagers' | 'tavernMat' | 'exile'> = [];
    tokens: ReadonlyArray<'journeyToken' | 'extraCard' | 'extraAction' | 'extraBuy' | 'extraMoney' | 'minusTwoCost' | 'minusOneCoin' | 'minusOneCard' | 'trashing' | 'estate'> = [];
    isCard = true;
    static descriptionSize = 60;
    static typelineSize = 64;
    static nameSize = 75;
    static inSupply = true;
    get inSupply(): (typeof Card)['inSupply'] {
        return (this.constructor as typeof Card).inSupply;
    }
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
    static get tokens(): typeof Card['tokens'] {
        // @ts-ignore
        return new this().tokens;
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
    abstract intrinsicCost: {coin: number; potion?: number; debt?: number};
    get cost(): Cost {
        if (this.game) {
            return this.game.getCostOfCard(this.name);
        }
        return Cost.fromJSON(this.intrinsicCost);
    }
    static get cost(): Cost {
        if (this === Card) {
            throw new Error("cost is only available on implemented cards.");
        }
        // @ts-ignore
        return Cost.fromJSON(new this().intrinsicCost);
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
    public static createSupplyPiles(playerCount: number, game: Game): Array<{identifier: string; pile: Card[]; identity: Card; displayCount: boolean; hideCost?: boolean; inSupply?: boolean; countForEmpty?: boolean}> {
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

    static getPileIdentifier(): string {
        // @ts-ignore
        return new this().getPileIdentifier();
    }

    public getPileIdentifier(): string | null {
        return this.name;
    }

    public static setup(globalCardData: any, game: Game) {

    }

    /**
     * Use this function to determine your dependant piles. For example, you might add 'ruined library'
     * This has a default implementation to use if, for example, you have the type of 'looter', so make sure to call `super.onChosen()`.
     */
    public static onChosen(): string[] {
        const def = [] as string[];
        if (this.types.includes("looter")) {
            def.push("ruins");
        }
        return def;
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
    public async onPlay(player: Player, exemptPlayers: Player[], tracker: Tracker<this>) {
        await player.events.emit('noActionImpl', this, exemptPlayers);
        throw new Error("onPlay should be implemented for all cards");
    }
    public async onWay(player: Player, exemptPlayers: Player[], tracker: Tracker<Card>) {
        throw new Error("onWay not implemented for Way-like card");
    }
    public async onAttackInHand(player: Player, attacker: Player, attackingCard: Card, playerAlreadyExempt: boolean): Promise<boolean> {
        return false;
    }
    public async onAttackInPlay(player: Player, attacker: Player, attackingCard: Card, playerAlreadyExempt: boolean): Promise<boolean> {
        return false;
    }
    public static async onBuy(player: Player): Promise<Card | null> {
        return await player.gain(this.cardName, undefined, false);
    }
    public onGainSelf(player: Player, tracker: Tracker<this>): Promise<void> | void {

    }
    public onTrashSelf(player: Player, tracker: Tracker<this>): Promise<void> | void {

    }
    public onRevealSelf(player: Player, tracker: Tracker<this>): Promise<void> | void {

    }
    public onCall(player: Player, exemptPlayers: Player[], tracker: Tracker<this>): Promise<void> | void {

    }
    private callCb: any = null;
    private callCbEventName: Effect | null = null;
    protected allowCallAtEvent<T extends Effect, K>(player: Player, tracker: Tracker<this>, eventName: T, config: EffectDef<T, K>['config']) {
        this.callCbEventName = eventName;
        this.callCb = async (remove) => {
            if (player.effects.inCompat) {
                player.data.tavernMat.forEach((a) => {
                    if (a.card.id === tracker.viewCard().id) {
                        a.canCall = true;
                    }
                });
                player.events.on('decision', async () => {
                    if (player.effects.currentEffect === eventName || player.isInterrupted) {
                        return true;
                    }
                    player.data.tavernMat.forEach((a) => {
                        if (a.card.id === tracker.viewCard().id) {
                            a.canCall = false;
                        }
                    });
                    return false;
                });
            }
            else {
                if (await player.confirmAction(Texts.doYouWantToCall(this.name))) {
                    await player.callReserve(this);
                    remove();
                }
            }
        };
        player.effects.setupEffect(eventName, this.name, {
            ...config,
            optional: true
        }, this.callCb);
    }
    async call(player: Player) {
        const card = player.data.tavernMat.find((a) => a.card.id === this.id);
        if (card) {
            const realCard = card.card;
            player.data.tavernMat.splice(player.data.tavernMat.findIndex((a) => a.card.id == card.card.id), 1);
            player.data.playArea.push(realCard);
            if (this.callCb) {
                player.effects.removeEffect(this.callCbEventName!, this.name, this.callCb);
                this.callCb = null;
            }
            await this.onCall(player, [], player.getTrackerInPlay(realCard) as Tracker<this>);
        }
    }
    protected moveToTavernMat(player: Player, tracker: Tracker<Card>): boolean {
        if (tracker.hasTrack) {
            player.data.tavernMat.push({
                card: tracker.exercise()!,
                canCall: false
            });
            return true;
        }
        return false;
    }
    public static registerInterrupts(game: Game) {
        if (this.types.includes("reserve")) {
            game.players.forEach((player) => player.ensureReserveInterrupt());
        }
        if (this.types.includes("way")) {
            game.players.forEach((player) => player.ensureWayInterrupt());
        }
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