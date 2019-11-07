import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Game from "../../server/Game";

export default class MarketSquare extends Card {
    static descriptionSize = 54;
    intrinsicTypes = ["action","reaction"] as const;
    name = "market square";
    cost = {
        coin: 3
    };
    cardText = "+1 Card\n" +
        "+1 Action\n" +
        "+1 Buy\n" +
        "---\n" +
        "When one of your cards is trashed, you may discard this from your hand to gain a Gold.";
    supplyCount = 10;
    cardArt = "/img/card-img/Market_SquareArt.jpg";
    async onAction(player: Player): Promise<void> {
        await player.draw(1);
        player.data.actions += 1;
        player.data.buys += 1;
    }
    public static setup(globalCardData: any, game: Game) {
        game.events.on('trash', async (player) => {
            const marketSquares = player.data.hand.filter((a) => a.name === 'market square');
            for (const card of marketSquares) {
                if (await player.confirmAction(Texts.wantToDiscardAForBenefit('market square', 'to gain a Gold'))) {
                    player.data.hand.splice(player.data.hand.indexOf(card), 1);
                    await player.discard(card, true);
                    await player.gain('gold');
                }
                else {
                    break;
                }
            }
            return true;
        });
    }
}
