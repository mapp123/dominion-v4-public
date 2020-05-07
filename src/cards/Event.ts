import Card from "./Card";
import type Player from "../server/Player";
import type Game from "../server/Game";
import type {GainRestrictions} from "../server/GainRestrictions";

export default abstract class Event extends Card {
    static descriptionSize = 30;
    intrinsicTypes = ["event"] as const;
    randomizable = false;
    supplyCount = 0;
    isCard = false;
    abstract onPurchase(player: Player): Promise<any>;
    static oncePerTurn = false;
    static oncePerGame = false;
    playersBoughtThisGame: Player[] = [];
    boughtOnTurn: Map<Player, number> = new Map<Player, number>();
    public static createSupplyPiles(playerCount: number, game: Game): Array<{identifier: string; pile: Card[]; identity: Card; displayCount: boolean; countForEmpty?: boolean}> {
        return [{
            identifier: this.cardName,
            // @ts-ignore
            pile: [new this(game)],
            // @ts-ignore
            identity: new this(game),
            displayCount: false,
            countForEmpty: false
        }];
    }
    static getInstance(player: Player): Event {
        return player.game.supply.data.piles.find((a) => a.identifier === this.cardName)!.identity as Event;
    }
    public static async onBuy(player: Player): Promise<Card | null> {
        const instance = this.getInstance(player);
        await instance.onPurchase(player);
        if (this.oncePerGame) {
            instance.playersBoughtThisGame.push(player);
        }
        else if (this.oncePerTurn) {
            instance.boughtOnTurn.set(player, player.turnNumber);
        }
        return null;
    }
    public static getExtraRestrictions(cardData: any, player: Player, restrictions: GainRestrictions): GainRestrictions {
        if (this.oncePerGame && this.getInstance(player).playersBoughtThisGame.includes(player)) {
            restrictions.addBannedCard(this.cardName);
        }
        else if (this.oncePerTurn && this.getInstance(player).boughtOnTurn.get(player) === player.turnNumber) {
            restrictions.addBannedCard(this.cardName);
        }
        return restrictions;
    }
}