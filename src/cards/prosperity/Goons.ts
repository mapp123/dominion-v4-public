import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import type Game from "../../server/Game";

export default class Goons extends Card {
    static descriptionSize = 54;
    intrinsicTypes = ["action","attack"] as const;
    name = "goons";
    features = ["vp"] as const;
    intrinsicCost = {
        coin: 6
    };
    cardText = "+1 Buy\n" +
        "+$2\n" +
        "Each other player discards down to 3 cards in hand.\n" +
        "---\n" +
        "While this is in play, when you buy a card, +1 VP.";
    supplyCount = 10;
    cardArt = "/img/card-img/GoonsArt.jpg";
    async onPlay(player: Player, exemptPlayers: Player[]): Promise<void> {
        player.data.buys++;
        await player.addMoney(2);
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
        game.players.forEach((player) => {
            player.effects.setupEffect('buy', 'goons', {
                compatibility: () => true,
                temporalRelevance: () => player.data.playArea.some((a) => a.name === 'goons')
            }, async () => {
                const goonsInPlay = player.data.playArea.filter((a) => a.name === 'goons');
                player.data.vp += goonsInPlay.length;
            });
        });
    }
}
