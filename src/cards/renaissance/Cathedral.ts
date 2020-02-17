import Project from "../Project";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Cathedral extends Project {
    cardArt = "/img/card-img/CathedralArt.jpg";
    cardText = "At the start of your turn, trash a card from your hand.";
    intrinsicCost = {
        coin: 3
    };
    name = "cathedral";
    async onPlayerJoinProject(player: Player): Promise<any> {
        player.effects.setupEffect('turnStart', 'cathedral', {}, async () => {
            player.lm('The cathedral activates for %p.');
            let card = await player.chooseCardFromHand(Texts.chooseCardToTrashFor('cathedral'));
            while (card && card.cost.coin > 2 && player.data.hand.find((a) => a.cost.coin < card!.cost.coin) != null && !await player.confirmAction(Texts.areYouSureYouWantToTrash(card.name))) {
                player.data.hand.push(card);
                card = await player.chooseCardFromHand(Texts.chooseCardToTrashFor('cathedral'));
            }
            if (card) {
                await player.trash(card);
            }
        });
    }
}