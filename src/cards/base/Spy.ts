import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";

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
        const topCard = (await p.revealTop(1, true))[0];
        if (topCard) {
            if (await player.confirmAction(Texts.shouldADiscardTheBOnTopOfTheirDeck(player === p ? "you" : p.username, topCard.viewCard().name))) {
                p.lm('%p discards the %s on top of their deck.', topCard.viewCard().name);
                if (topCard.hasTrack) {
                    await p.discard(topCard.exercise()!);
                }
            }
            else {
                p.lm('%p puts the %s back on top of their deck.', topCard.viewCard().name);
                if (topCard.hasTrack) {
                    p.deck.cards.unshift(topCard.exercise()!);
                }
            }
        }
    }
    async onPlay(player: Player, exemptPlayers: Player[]): Promise<void> {
        await player.draw();
        player.data.actions += 1;
        await this.affectPlayer(player, player);
        await player.attackOthersInOrder(exemptPlayers, async (p) => {
            await this.affectPlayer(player, p);
        });
    }
}
