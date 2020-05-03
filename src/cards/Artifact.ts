import Card from "./Card";
import type Player from "../server/Player";
import type Game from "../server/Game";
import {UNCOUNTED_EMPTY_SUPPLY_PILE} from "../server/Supply";

export default abstract class Artifact extends Card {
    static descriptionSize = 30;
    intrinsicTypes = ["artifact"] as const;
    randomizable = false;
    supplyCount = 0;
    intrinsicCost = {
        coin: 0
    };
    belongsToPlayer: Player | null = null;
    protected abstract setup(game: Game);
    protected abstract giveToPlayer(player: Player);
    public static createSupplyPiles(playerCount: number, game: Game): Array<{identifier: string; pile: Card[]; identity: Card; displayCount: boolean; hideCost?: boolean; countForEmpty?: boolean}> {
        return [{
            identifier: this.cardName,
            // @ts-ignore
            pile: UNCOUNTED_EMPTY_SUPPLY_PILE,
            // @ts-ignore
            identity: new this(game),
            displayCount: false,
            hideCost: true,
            countForEmpty: false
        }];
    }
    private static getInstance(player: Player): Artifact {
        return player.game.supply.data.piles.find((a) => a.identifier === this.cardName)!.identity as Artifact;
    }
    static getI(game: Game): Artifact {
        return game.supply.data.piles.find((a) => a.identifier === this.cardName)!.identity as Artifact;
    }
    public static setup(globalCardData: any, game: Game) {
        this.getI(game).setup(game);
    }
    public static giveTo(player: Player) {
        this.getInstance(player).getGlobalData().player = player.username;
        this.getInstance(player).belongsToPlayer = player;
        this.getInstance(player).giveToPlayer(player);
    }
    public static getSupplyMarkers(cardData: any): {[card: string]: string[]} | null {
        if (cardData.player) {
            return {
                [this.cardName]: [cardData.player]
            };
        }
        return {};
    }
}