import Card from "../Card";
import Player from "../../server/Player";
import Util from "../../Util";

export default class Vagrant extends Card {
    intrinsicTypes = ["action"] as const;
    name = "vagrant";
    intrinsicCost = {
        coin: 2
    };
    cardText = "+1 Card\n" +
        "+1 Action\n" +
        "Reveal the top card of your deck. If it's a Curse, Ruins, Shelter, or Victory card, put it into your hand.";
    supplyCount = 10;
    cardArt = "/img/card-img/VagrantArt.jpg";
    async onAction(player: Player): Promise<void> {
        await player.draw(1);
        player.data.actions++;
        let card = await player.deck.pop();
        if (card) {
            card = (await player.reveal([card]))[0];
        }
        if (card) {
            if (card.types.some((a) => ['curse', 'ruins', 'shelter', 'victory'].includes(a))) {
                player.lm('%p reveals %s, putting it into their hand.', Util.formatCardList([card.name]));
                player.data.hand.push(card);
            }
            else {
                player.lm('%p reveals %s.', Util.formatCardList([card.name]));
                player.deck.setCards([card, ...player.deck.cards]);
            }
        }
    }
}
