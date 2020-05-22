import Card, {isOriginal, original} from "./Card";
import type Player from "../server/Player";
import type Game from "../server/Game";
import type Tracker from "../server/Tracker";

export default abstract class Way extends Card {
    static nameSize = 30;
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
    @original
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected compatibility(cardName: string, card: Tracker<Card>, naturalPlay: boolean): boolean {
        return false;
    }
    @original
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected relevant(card: Tracker<Card>, naturalPlay: boolean): boolean {
        return true;
    }
    public static setup(globalCardData: any, game: Game) {
        const instance = this.getInstance({game} as any);
        game.players.forEach((player) => {
            player.effects.setupEffect('play', this.cardName, {
                compatibility: isOriginal(instance.compatibility) ? {} : instance.compatibility.bind(instance),
                requiresUnconsumed: true,
                relevant: (ctx, tracker, natural) => !natural && tracker.viewCard().types.includes("action") && (isOriginal(instance.relevant) || instance.relevant(tracker, natural))
            }, async (remove, tracker) => {
                remove.consumed = true;
                player.lm('...as %s.', this.cardName);
                await this.getInstance(player).onWay(player, [], tracker);
            });
        });
    }
}