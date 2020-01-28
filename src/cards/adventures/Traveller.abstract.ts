import Card from "../Card";
import Player from "../../server/Player";
import Tracker from "../../server/Tracker";
import {Texts} from "../../server/Texts";

export default abstract class Traveller extends Card {
    abstract travellerTarget: string;
    async onDiscardFromPlay(player: Player, tracker: Tracker<Card>): Promise<any> {
        if (tracker.hasTrack && player.game.supply.getPile(this.travellerTarget)!.length > 0 && await player.confirmAction(Texts.doYouWantToExchangeXForY(this.name, this.travellerTarget))) {
            await player.lm('%p exchanges a %s for a %s.', this.name, this.travellerTarget);
            player.game.supply.getPile(this.name)!.push(tracker.exercise()!);
            player.deck.discard.push(player.game.grabNameFromSupply(this.travellerTarget)!);
        }
    }
    public static onChosen() {
        // @ts-ignore
        return [new this().travellerTarget];
    }
}