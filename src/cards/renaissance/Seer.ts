import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";

export default class Seer extends Card {
    types = ["action"] as const;
    name = "seer";
    cost = {
        coin: 5
    };
    cardText = "+1 Card\n" +
        "+1 Action\n" +
        "Reveal the top 3 cards of your deck. Put the ones costing from $2 to $4 into your hand. Put the rest back in any order.";
    supplyCount = 10;
    cardArt = "/img/card-img/SeerArt.jpg";
    async onAction(player: Player): Promise<void> {
        await player.draw(1);
        player.data.actions++;
        let revealed = [await player.deck.pop(), await player.deck.pop(), await player.deck.pop()].filter((a) => a) as Card[];
        player.lm('%p reveals %s.', Util.formatCardList(revealed.map((a) => a.name)));
        revealed = await player.reveal(revealed);
        revealed = revealed.filter((a) => {
            const cost = player.game.getCostOfCard(a.name).coin;
            if (cost <= 4 && cost >= 2) {
                player.lm('%p takes the %s.', a.name);
                player.data.hand.push(a);
                return false;
            }
            return true;
        });
        revealed = await player.chooseOrder(Texts.chooseOrderOfCards, revealed, 'Top of Deck', 'Bottom of Deck');
        player.lm('%p puts the rest back in any order.');
        player.deck.setCards([...revealed, ...player.deck.cards]);
    }
}
