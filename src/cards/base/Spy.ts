import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";

export default class Spy extends Card {
    intrinsicTypes = ["action","attack"] as const;
    name = "spy";
    intrinsicCost = {
        coin: 4
    };
    cardText = "+1 Card\n" +
        "+1 Action\n" +
        "Each player (including you) reveals the top card of his deck and either discards it or puts it back, your choice.";
    supplyCount = 10;
    cardArt = "/img/card-img/SpyArt.jpg";
    async affectPlayer(player: Player, p: Player) {
        let topCard = await p.deck.peek();
        if (topCard) {
            player.lm('%p reveals %s.', Util.formatCardList([topCard.name]));
            topCard = (await player.reveal([topCard]))[0];
            if (!topCard) {
                return;
            }
            if (await player.confirmAction(Texts.shouldADiscardTheBOnTopOfTheirDeck(player === p ? "you" : p.username, topCard.name))) {
                p.lm('%p discards the %s on top of their deck.', topCard.name);
                await p.discard((await p.deck.pop())!);
            }
            else {
                p.lm('%p puts the %s back on top of their deck.', topCard.name);
            }
        }
    }
    async onAction(player: Player, exemptPlayers: Player[]): Promise<void> {
        await player.draw();
        player.data.actions += 1;
        await this.affectPlayer(player, player);
        await player.attackOthersInOrder(exemptPlayers, async (p) => {
            await this.affectPlayer(player, p);
        });
    }
}
