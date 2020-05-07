import type Player from "../../server/Player";
import Event from "../Event";
import {Texts} from "../../server/Texts";
import {GainRestrictions} from "../../server/GainRestrictions";
import Cost from "../../server/Cost";

export default class Seaway extends Event {
    cardArt = "/img/card-img/SeawayArt.jpg";
    cardText = "Gain an Action card costing up to $4. Move your +1 Buy token to its pile. (When you play a card from that pile, you first get +1 Buy.)";
    intrinsicCost = {
        coin: 5
    };
    name = "seaway";
    async onPurchase(player: Player): Promise<any> {
        await player.chooseGain(Texts.chooseCardToGainFor('seaway'), false, GainRestrictions.instance().setUpToCost(Cost.create(4)));
        const tokenPosition = await player.chooseGain(Texts.whereWantXToken('+1 Buy'), false, GainRestrictions.instance().setMustIncludeType('action').setIsAvailable(false), 'none');
        if (tokenPosition) {
            player.data.tokens.extraBuy = tokenPosition.getPileIdentifier();
        }
    }
}