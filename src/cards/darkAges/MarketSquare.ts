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
        await player.draw(1, true);
        player.data.actions += 1;
        player.data.buys += 1;
    }
    public static setup(globalCardData: any, game: Game) {
        game.players.forEach((player) => {
            player.effects.setupMultiEffect('trash', 'market square', {
                compatibility: {
                    sewers: true
                },
                getItems: () => player.data.hand.filter((a) => a.name === 'market square').map((a) => a.id),
                runsOnce: false,
                optional: true
            }, async (remove) => {
                let first = true;
                let nextId: string;
                while ((nextId = remove.additionalCtx['market square']()) != null && ((!player.effects.inCompat && first) || await player.confirmAction(Texts.wantToDiscardAForBenefit('market square', 'to gain a Gold')))) {
                    first = false;
                    const card = player.data.hand.splice(player.data.hand.findIndex((a) => a.id === nextId), 1)[0];
                    await player.discard(card, true);
                    await player.gain('gold');
                }
                if (nextId != null && !player.effects.inCompat) {
                    remove.additionalCtx['market square'](nextId);
                }
            });
        });
    }
}
