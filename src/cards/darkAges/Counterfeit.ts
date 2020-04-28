import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Tracker from "../../server/Tracker";
import Util from "../../Util";

export default class Counterfeit extends Card {
    intrinsicTypes = ["treasure"] as const;
    name = "counterfeit";
    intrinsicCost = {
        coin: 5
    };
    cardText = "$1\n" +
        "+1 Buy\n" +
        "When you play this, you may play a Treasure from your hand twice. If you do, trash that Treasure.";
    supplyCount = 10;
    cardArt = "/img/card-img/CounterfeitArt.jpg";
    intrinsicValue = 1;
    async onPlay(player: Player): Promise<void> {
        player.data.money += 1;
        player.data.buys += 1;
        const card = await player.chooseCardFromHand(Texts.chooseCardToPlayTwice, true, (card) => card.types.includes("treasure"));
        if (card) {
            player.data.playArea.push(card);
            const tracker = new Tracker(card);
            player.lm('%p chooses and plays %s.', Util.formatCardList([card.name]));
            await player.playCard(card, tracker, false);
            player.lm('%p replays %s.', card.name);
            await player.playCard(card, tracker, false);
            if (tracker.hasTrack) {
                player.data.playArea.splice(player.data.playArea.indexOf(tracker.viewCard()), 1);
                await player.trash(tracker.exercise()!);
            }
        }
    }
}
