import Card from "../Card";
import Cost from '../../server/Cost';
import type Player from "../../server/Player";
import type Game from "../../server/Game";

export default class Quarry extends Card {
    intrinsicTypes = ["treasure"] as const;
    name = "quarry";
    intrinsicCost = {
        coin: 4
    };
    cardText = "+$1\n---\nWhile this is in play, Action cards cost $2 less, but not less than $0.";
    supplyCount = 10;
    cardArt = "/img/card-img/QuarryArt.jpg";
    intrinsicValue = 1;
    async onPlay(player: Player): Promise<void> {
        await player.addMoney(1);
        player.game.updateCostModifiers();
    }
    async onDiscardFromPlay(player: Player): Promise<any> {
        player.game.updateCostModifiers();
    }

    public static getCostModifier(cardData: any, game: Game, activatedCards: string[]): {[card: string]: Cost} | null {
        const cardsInPlay = game.players.reduce((sum, player) => {
            return sum + player.data.playArea.filter((a) => a.name === 'quarry').length;
        }, 0);
        return activatedCards.reduce((obj, card) => {
            return {
                ...obj,
                [card]: Cost.create(game.getCard(card).types.includes("action") ? cardsInPlay * -2 : 0)
            };
        }, {});
    }
}
