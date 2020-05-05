import type Player from "../../server/Player";
import Event from "../Event";
import {Texts} from "../../server/Texts";
import {GainRestrictions} from "../../server/GainRestrictions";

export default class Ferry extends Event {
    cardArt = "/img/card-img/FerryArt.jpg";
    cardText = "Move your -$2 cost token to an Action Supply pile. (Cards from that pile cost $2 less on your turns, but not less than $0.)";
    tokens = ["minusTwoCost"] as const;
    intrinsicCost = {
        coin: 3
    };
    name = "ferry";
    async onPurchase(player: Player): Promise<any> {
        const card = await player.chooseGain(Texts.whereWantXToken('-$2 cost'), false, GainRestrictions.instance().setMustIncludeType('action').setIsAvailable(false), 'none');
        if (card) {
            player.data.tokens.minusTwoCost = card.getPileIdentifier();
            player.game.updateCostModifiers();
        }
    }
}