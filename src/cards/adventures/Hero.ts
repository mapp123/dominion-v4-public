import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import {GainRestrictions} from "../../server/GainRestrictions";
import Tracker from "../../server/Tracker";

export default class Hero extends Card {
    static descriptionSize = 57;
    intrinsicTypes = ["action","traveller"] as const;
    name = "hero";
    intrinsicCost = {
        coin: 5
    };
    cardText = "+$2\n" +
        "Gain a Treasure.\n" +
        "---\n" +
        "When you discard this from play, you may exchange it for a Champion.\n" +
        "(This is not in the Supply.)";
    supplyCount = 5;
    cardArt = "/img/card-img/800px-HeroArt.jpg";
    randomizable = false;
    static inSupply = false;
    async onAction(player: Player): Promise<void> {
        player.data.money += 2;
        await player.chooseGain(Texts.chooseCardToGainFor('hero'), false, GainRestrictions.instance().setMustIncludeType('treasure'));
    }
    async onDiscardFromPlay(player: Player, tracker: Tracker<Card>): Promise<any> {
        if (tracker.hasTrack && player.game.supply.getPile('champion')!.length > 0 && await player.confirmAction(Texts.doYouWantToExchangeXForY('hero', 'champion'))) {
            await player.lm('%p exchanges a hero for a champion.');
            player.game.supply.getPile(this.name)!.push(tracker.exercise()!);
            player.deck.discard.push(player.game.grabNameFromSupply('champion')!);
        }
    }
    public static onChosen() {
        return ['champion'];
    }
}
