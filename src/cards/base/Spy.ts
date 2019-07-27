import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Spy extends Card {
    types = ["action","attack"] as const;
    name = "spy";
    cost = {
        coin: 4
    };
    cardText = "+1 Card\n" +
        "+1 Action\n" +
        "Each player (including you) reveals the top card of his deck and either discards it or puts it back, your choice.";
    supplyCount = 10;
    cardArt = "/img/card-img/SpyArt.jpg";
    async affectPlayer(player: Player, p: Player) {
        const topCard = p.deck.peek();
        if (topCard) {
            if (await player.confirmAction(Texts.shouldADiscardTheBOnTopOfTheirDeck(player === p ? "you" : p.username, topCard.name))) {
                p.lm('%p discards the %s on top of their deck.', topCard.name);
                await p.discard(p.deck.pop()!);
            }
            else {
                p.lm('%p puts the %s back on top of their deck.', topCard.name);
            }
        }
    }
    async onAction(player: Player, exemptPlayers: Player[]): Promise<void> {
        player.draw();
        player.data.actions += 1;
        await this.affectPlayer(player, player);
        await player.affectOthersInOrder(async (p) => {
            await this.affectPlayer(player, p);
        });
    }
}
