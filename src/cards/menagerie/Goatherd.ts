import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Goatherd extends Card {
    intrinsicTypes = ["action"] as const;
    name = "goatherd";
    intrinsicCost = {
        coin: 3
    };
    cardText = "+1 Action\n" +
        "You may trash a card from your hand.\n" +
        "+1 Card per card the player to your right trashed on their last turn.";
    supplyCount = 10;
    cardArt = "/img/card-img/GoatherdArt.jpg";
    async onPlay(player: Player): Promise<void> {
        player.data.actions++;
        const card = await player.chooseCardFromHand(Texts.chooseCardToTrashFor('goatherd'), true);
        if (card) {
            await player.trash(card);
        }
        let lastPlayerIndex = player.game.players.findIndex((a) => a.id === player.id) - 1;
        if (lastPlayerIndex < 0) {
            lastPlayerIndex += player.game.players.length;
        }
        await player.draw(player.game.players[lastPlayerIndex].trashedCards.length, true);
    }
}
