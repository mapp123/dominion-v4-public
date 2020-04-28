import Card from "../Card";
import type Player from "../../server/Player";
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
    async onPlay(player: Player): Promise<void> {
        await player.draw(1);
        player.data.actions++;
        const card = (await player.revealTop(1))[0];
        if (card) {
            if (card.viewCard().types.some((a) => ['curse', 'ruins', 'shelter', 'victory'].includes(a))) {
                player.lm('%p reveals %s, putting it into their hand.', Util.formatCardList([card.viewCard().name]));
                if (card.hasTrack) {
                    player.data.hand.push(card.exercise()!);
                }
            }
            else {
                player.lm('%p reveals %s.', Util.formatCardList([card.viewCard().name]));
                if (card.hasTrack) {
                    player.deck.setCards([card.exercise()!, ...player.deck.cards]);
                }
            }
        }
    }
}
