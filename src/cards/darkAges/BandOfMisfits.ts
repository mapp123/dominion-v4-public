import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import {GainRestrictions} from "../../server/GainRestrictions";
import Tracker from "../../server/Tracker";

export default class BandOfMisfits extends Card {
    intrinsicTypes = ["action", "command"] as const;
    name = "band of misfits";
    cost = {
        coin: 5
    };
    cardText = "Play a non-Command Action card from the Supply that costs less than this, leaving it there.";
    supplyCount = 10;
    cardArt = "/img/card-img/Band_of_MisfitsArt.jpg";
    async onAction(player: Player): Promise<void> {
        const cardToPlay = await player.chooseGain(Texts.chooseCardFromSupplyToPlay, false, GainRestrictions.instance().setMaxCoinCost(player.game.getCostOfCard(this.name).coin - 1).addBannedType('command').setMustIncludeType('action'), "none");
        if (cardToPlay) {
            const tracker = new Tracker(cardToPlay);
            tracker.loseTrack();
            player.lm('%p chooses and plays the %s.', cardToPlay.name);
            await player.playActionCard(cardToPlay, tracker, false);
        }
    }
}
