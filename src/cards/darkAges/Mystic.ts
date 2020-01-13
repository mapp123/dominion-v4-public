import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";
import shuffle from "../../server/util/shuffle";

export default class Mystic extends Card {
    intrinsicTypes = ["action"] as const;
    name = "mystic";
    intrinsicCost = {
        coin: 5
    };
    cardText = "+1 Action\n" +
        "+$2\n" +
        "Name a card, then reveal the top card of your deck. If you named it, put it into your hand.";
    supplyCount = 10;
    cardArt = "/img/card-img/MysticArt.jpg";
    async onAction(player: Player): Promise<void> {
        player.data.actions += 1;
        player.data.money += 2;
        const card = await player.chooseCard(Texts.chooseCardToNameFor('mystic'), shuffle(Util.deduplicateByName(player.allCards)));
        if (card) {
            const revealed = await player.revealTop(1, true);
            if (revealed[0].viewCard().name === card.name && revealed[0].hasTrack) {
                player.lm('%p puts the revealed %s into their hand.', revealed[0].viewCard().name);
                player.data.hand.push(revealed[0].exercise()!);
            }
            else if (revealed[0].hasTrack) {
                player.lm('%p returns the %s to their deck.', revealed[0].viewCard().name);
                player.deck.cards.unshift(revealed[0].exercise()!);
            }
        }
    }
}
