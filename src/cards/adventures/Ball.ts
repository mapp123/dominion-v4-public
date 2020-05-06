import type Player from "../../server/Player";
import Event from "../Event";
import {Texts} from "../../server/Texts";
import Cost from "../../server/Cost";
import {GainRestrictions} from "../../server/GainRestrictions";

export default class Ball extends Event {
    cardArt = "/img/card-img/800px-BallArt.jpg";
    cardText = "Take your –$1 token. Gain 2 cards each costing up to $4.";
    tokens = ["minusOneCoin"] as const;
    intrinsicCost = {
        coin: 5
    };
    name = "ball";
    async onPurchase(player: Player): Promise<any> {
        player.data.tokens.minusOneCoin = true;
        await player.chooseGain(Texts.chooseCardToGainFor(this.name), false, GainRestrictions.instance().setUpToCost(Cost.create(4)));
        await player.chooseGain(Texts.chooseCardToGainFor(this.name), false, GainRestrictions.instance().setUpToCost(Cost.create(4)));
    }
}