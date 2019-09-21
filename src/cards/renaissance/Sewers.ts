import Project from "../Project";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Card from "../Card";

export default class Sewers extends Project {
    cardArt = "/img/card-img/SewersArt.jpg";
    cardText = "When you trash a card other than with this, you may trash a card from your hand.";
    cost = {
        coin: 3
    };
    name = "sewers";
    async onPlayerJoinProject(player: Player): Promise<any> {
        let trashingCard: Card | null = null;
        player.events.on('trash', async (trashedCard) => {
            if (trashingCard !== trashedCard) {
                player.lm('The sewers activates for %p.');
                const card = await player.chooseCardFromHand(Texts.chooseCardToTrashFor('sewers'), true);
                if (card) {
                    let lastTrashingCard = trashingCard;
                    trashingCard = card;
                    await player.trash(card);
                    trashingCard = lastTrashingCard;
                }
            }
            return true;
        });
    }
}