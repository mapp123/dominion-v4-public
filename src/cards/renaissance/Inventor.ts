import Card, {Cost} from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import {GainRestrictions} from "../../server/GainRestrictions";
import Game from "../../server/Game";

export default class Inventor extends Card {
    types = ["action"] as const;
    name = "inventor";
    cost = {
        coin: 4
    };
    cardText = "Gain a card costing up to $4, then cards cost $1 less this turn (but not less than $0).";
    supplyCount = 10;
    cardArt = "/img/card-img/InventorArt.jpg";
    async onAction(player: Player): Promise<void> {
        await player.chooseGain(Texts.chooseCardToGainFor('inventor'), false, GainRestrictions.instance().setMaxCoinCost(4));
        const data = this.getGlobalData();
        if (typeof data.number === 'undefined') {
            data.number = 0;
        }
        data.number++;
        player.game.updateCostModifiers();
    }

    public static getCostModifier(cardData: any, game: Game, activatedCards: string[]): {[card: string]: Cost} | null {
        return activatedCards.reduce((last, card) => {
            return {
                ...last,
                [card]: {
                    coin: -cardData.number
                }
            };
        }, {});
    }

    public static setup(globalCardData: any, game: Game) {
        globalCardData.number = 0;
        game.events.on('turnStart', () => {
            globalCardData.number = 0;
            game.updateCostModifiers();
            return true;
        });
    }
}
