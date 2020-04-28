import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import type Game from "../../server/Game";

export default class MarketSquare extends Card {
    static descriptionSize = 54;
    intrinsicTypes = ["action","reaction"] as const;
    name = "market square";
    intrinsicCost = {
        coin: 3
    };
    cardText = "+1 Card\n" +
        "+1 Action\n" +
        "+1 Buy\n" +
        "---\n" +
        "When one of your cards is trashed, you may discard this from your hand to gain a Gold.";
    supplyCount = 10;
    cardArt = "/img/card-img/Market_SquareArt.jpg";
    async onPlay(player: Player): Promise<void> {
        await player.draw(1);
        player.data.actions += 1;
        player.data.buys += 1;
    }
    public static setup(globalCardData: any, game: Game) {
        game.players.forEach((player) => {
            player.effects.setupEffect('trash', 'market square', {
                compatibility: {
                    sewers: true
                },
                temporalRelevance: () => player.data.hand.some((a) => a.name === 'market square'),
                optional: true,
                duplicate: () => player.data.hand.filter((a) => a.name === 'market square').map((a) => a.id)
            }, async (ctx) => {
                const card = player.data.hand.find((a) => a.id === ctx.ctx.duplicateKey);
                if (card != null && (!player.effects.inCompat || await player.confirmAction(Texts.wantToDiscardAForBenefit('market square', 'to gain a Gold')))) {
                    player.data.hand.splice(player.data.hand.indexOf(card), 1);
                    await player.discard(card, true);
                    await player.gain('gold');
                }
                else {
                    ctx.skipDuplicates();
                }
            });
        });
    }
}
