import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import type Game from "../../server/Game";

export default class Sheepdog extends Card {
    intrinsicTypes = ["action","reaction"] as const;
    name = "sheepdog";
    intrinsicCost = {
        coin: 3
    };
    cardText = "+2 Cards\n" +
        "---\n" +
        "When you gain a card, you may play this from your hand.";
    supplyCount = 10;
    cardArt = "/img/card-img/SheepdogArt.jpg";
    async onPlay(player: Player): Promise<void> {
        await player.draw(2, true);
    }
    static setup(data: any, game: Game) {
        game.players.forEach((player) => {
            player.effects.setupMultiEffect('gain', this.cardName, {
                compatibility: {},
                getItems: () => player.data.hand.filter((a) => a.name === 'sheepdog').map((a) => a.id),
                optional: true
            }, async (remove) => {
                let first = true;
                let cardId: string;
                while ((cardId = remove.additionalCtx.sheepdog()) != null && ((!player.effects.inCompat && first) || await player.confirmAction(Texts.doYouWantToPlay('sheepdog')))) {
                    first = false;
                    const card = player.data.hand.splice(player.data.hand.findIndex((a) => a.id === cardId), 1)[0];
                    player.data.playArea.push(card);
                    await player.playCard(card, null);
                }
                if (cardId != null && !player.effects.inCompat) {
                    remove.additionalCtx.sheepdog(cardId);
                }
            });
        });
    }
}
