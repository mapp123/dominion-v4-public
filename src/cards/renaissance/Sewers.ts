import Project from "../Project";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import type Card from "../Card";

export default class Sewers extends Project {
    cardArt = "/img/card-img/SewersArt.jpg";
    cardText = "When you trash a card other than with this, you may trash a card from your hand.";
    intrinsicCost = {
        coin: 3
    };
    name = "sewers";
    async onPlayerJoinProject(player: Player): Promise<any> {
        let trashingCard: Card | null = null;
        player.effects.setupEffect('trash', 'sewers', {
            compatibility: {},
            relevant: (ctx, tracker) => trashingCard !== tracker.viewCard()
        }, async (remove, tracker) => {
            if (trashingCard !== tracker.viewCard()) {
                player.lm('The sewers activates for %p.');
                const card = await player.chooseCardFromHand(Texts.chooseCardToTrashFor('sewers'), true);
                if (card) {
                    const lastTrashingCard = trashingCard;
                    trashingCard = card;
                    await player.trash(card);
                    trashingCard = lastTrashingCard;
                }
            }
        });
    }
}