import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Tracker from "../../server/Tracker";

export default class Page extends Card {
    intrinsicTypes = ["action","traveller"] as const;
    name = "page";
    intrinsicCost = {
        coin: 2
    };
    cardText = "+1 Card\n" +
        "+1 Action\n" +
        "---\n" +
        "When you discard this from play, you may exchange it for a Treasure Hunter.";
    supplyCount = 10;
    cardArt = "/img/card-img/PageArt.jpg";
    async onAction(player: Player): Promise<void> {
        await player.draw();
        player.data.actions++;
    }
    async onDiscardFromPlay(player: Player, tracker: Tracker<Card>): Promise<any> {
        if (tracker.hasTrack && player.game.supply.getPile('treasure hunter')!.length > 0 && await player.confirmAction(Texts.doYouWantToExchangeXForY('page', 'treasure hunter'))) {
            await player.lm('%p exchanges a page for a treasure hunter.');
            player.game.supply.getPile(this.name)!.push(tracker.exercise()!);
            player.deck.discard.push(player.game.grabNameFromSupply('treasure hunter')!);
        }
    }
    public static onChosen() {
        return ['treasure hunter'];
    }
}
