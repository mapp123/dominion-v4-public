import type Player from "../../server/Player";
import Event from "../Event";
import {Texts} from "../../server/Texts";
import {GainRestrictions} from "../../server/GainRestrictions";

export default class LostArts extends Event {
    cardArt = "/img/card-img/LostArtsArt.jpg";
    cardText = "Move your +1 Action token to an Action Supply pile. (When you play a card from that pile, you first get +1 Action.)";
    intrinsicCost = {
        coin: 6
    };
    name = "lost arts";
    async onPurchase(player: Player): Promise<any> {
        const tokenLocation = await player.chooseGain(Texts.whereWantXToken('+1 Action'), false, GainRestrictions.instance().setMustIncludeType('action').setIsAvailable(false), 'none');
        if (tokenLocation) {
            player.data.tokens.extraAction = tokenLocation.getPileIdentifier();
        }
    }
}