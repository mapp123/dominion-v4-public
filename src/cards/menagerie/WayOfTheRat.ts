import type Player from "../../server/Player";
import Way from "../Way";
import type Tracker from "../../server/Tracker";
import type Card from "../Card";
import Util from "../../Util";
import {Texts} from "../../server/Texts";

export default class WayOfTheRat extends Way {
    cardArt = "/img/card-img/Way_of_the_RatArt.jpg";
    cardText = "You may discard a Treasure to gain a copy of this.";
    name = "way of the rat";
    async onWay(player: Player, exemptPlayers: Player[], tracker: Tracker<Card>): Promise<void> {
        const card = await player.chooseCardFromHand(Texts.discardAForBenefit('treasure', 1, `gain ${Util.formatCardList([tracker.viewCard()])}`), true, (card) => card.types.includes('treasure'));
        if (card) {
            await player.discard(card);
            await player.gain(tracker.viewCard().name);
        }
    }
}