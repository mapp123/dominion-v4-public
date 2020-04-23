import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import {GainRestrictions} from "../../server/GainRestrictions";
import type Game from "../../server/Game";
import Cost from '../../server/Cost';

export default class Inventor extends Card {
    intrinsicTypes = ["action"] as const;
    name = "inventor";
    intrinsicCost = {
        coin: 4
    };
    cardText = "Gain a card costing up to $4, then cards cost $1 less this turn (but not less than $0).";
    supplyCount = 10;
    cardArt = "/img/card-img/InventorArt.jpg";
    async onAction(player: Player): Promise<void> {
        await player.chooseGain(Texts.chooseCardToGainFor('inventor'), false, GainRestrictions.instance().setUpToCost(Cost.create(4)));
        const data = this.getGlobalData();
        if (typeof data.number === 'undefined') {
            data.number = 0;
        }
        data.number++;
        player.game.updateCostModifiers();
    }

    public static getCostModifier(cardData: any, game: Game, activatedCards: string[]): {[card: string]: Cost} | null {
        return activatedCards.reduce((last, card) => {
            if (!game.getCard(card).isCard) {
                return last;
            }
            return {
                ...last,
                [card]: Cost.create(-cardData.number)
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
