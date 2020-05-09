import Card from "./Card";
import type Player from "../server/Player";
import type Game from "../server/Game";

export default abstract class Way extends Card {
    static descriptionSize = 30;
    intrinsicTypes = ["way"] as const;
    randomizable = false;
    supplyCount = 0;
    isCard = false;
    intrinsicCost = {
        coin: 0
    }
    static inSupply = false;
    public static createSupplyPiles(playerCount: number, game: Game): Array<{identifier: string; pile: Card[]; identity: Card; displayCount: boolean; countForEmpty?: boolean; hideCost?: boolean}> {
        return [{
            identifier: this.cardName,
            pile: [],
            // @ts-ignore
            identity: new this(game),
            displayCount: false,
            countForEmpty: false,
            hideCost: true
        }];
    }
    static getInstance(player: Player): Way {
        return player.game.supply.data.piles.find((a) => a.identifier === this.cardName)!.identity as Way;
    }
    public static setup(globalCardData: any, game: Game) {
        game.players.forEach((player) => {
            player.effects.setupEffect('play', this.cardName, {
                compatibility: {},
                requiresUnconsumed: true,
                relevant: (tracker, natural) => !natural && tracker.viewCard().types.includes("action")
            }, async (remove, tracker) => {
                remove.consumed = true;
                player.lm('...as %s.', this.cardName);
                await this.getInstance(player).onWay(player, [], tracker);
            });
        });
    }
}