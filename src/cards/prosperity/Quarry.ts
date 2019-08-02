import Card, {Cost} from "../Card";
import Player from "../../server/Player";
import Game from "../../server/Game";

export default class Quarry extends Card {
    types = ["treasure"] as const;
    name = "quarry";
    cost = {
        coin: 4
    };
    cardText = "+$1\nWhile this is in play, Action cards cost $2 less, but not less than $0.";
    supplyCount = 10;
    cardArt = "/img/card-img/QuarryArt.jpg";
    protected async onTreasure(player: Player): Promise<void> {
        player.data.money += 1;
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
                [card]: {
                    coin: game.getCard(card).types.includes("action") ? cardsInPlay * -2 : 0
                }
            };
        }, {});
    }
}
