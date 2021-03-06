import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";

export default class Vassal extends Card {
    intrinsicTypes = ["action"] as const;
    name = "vassal";
    intrinsicCost = {
        coin: 3
    };
    cardText = "+$2\n" +
        "Discard the top card of your deck. If it is an Action card, you may play it.";
    supplyCount = 10;
    cardArt = "/img/card-img/VassalArt.jpg";
    async onPlay(player: Player): Promise<void> {
        await player.addMoney(2);
        const card = await player.deck.pop();
        if (card) {
            player.lm('%p discards %s.', Util.formatCardList([card.name]));
            await player.discard(card);
            if (player.deck.discard[player.deck.discard.length - 1] === card
                && card.types.includes("action")
                && await player.confirmAction(Texts.playCardFromDiscard(card.name))) {
                player.deck.discard.pop();
                player.data.playArea.push(card);
                player.lm('%p plays the discarded %s.', card.name);
                await player.playCard(card, null, false);
            }
        }
    }
}