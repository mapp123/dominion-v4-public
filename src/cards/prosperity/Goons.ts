import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Game from "../../server/Game";

export default class Goons extends Card {
    static descriptionSize = 54;
    intrinsicTypes = ["action","attack"] as const;
    name = "goons";
    features = ["vp"] as const;
    cost = {
        coin: 6
    };
    cardText = "+1 Buy\n" +
        "+$2\n" +
        "Each other player discards down to 3 cards in hand.\n" +
        "---\n" +
        "While this is in play, when you buy a card, +1 VP.";
    supplyCount = 10;
    cardArt = "/img/card-img/GoonsArt.jpg";
    async onAction(player: Player, exemptPlayers: Player[]): Promise<void> {
        player.data.buys++;
        player.data.money += 2;
        await player.attackOthers(exemptPlayers, async (player) => {
            while (player.data.hand.length > 3) {
                const card = await player.chooseCardFromHand(Texts.chooseCardToDiscardFor('goons'));
                if (card) {
                    await player.discard(card, true);
                }
            }
        });
    }
    public static setup(globalCardData: any, game: Game) {
        game.events.on('buy', (player) => {
            const goonsInPlay = player.data.playArea.filter((a) => a.name === 'goons');
            player.data.vp += goonsInPlay.length;
            return true;
        });
    }
}
