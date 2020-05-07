import type Player from "../../server/Player";
import Event from "../Event";
import {Texts} from "../../server/Texts";
import {GainRestrictions} from "../../server/GainRestrictions";

export default class Training extends Event {
    cardArt = "/img/card-img/TrainingArt.jpg";
    cardText = "Move your +$1 token to an Action Supply pile. (When you play a card from that pile, you first get +$1.)";
    intrinsicCost = {
        coin: 6
    };
    name = "training";
    async onPurchase(player: Player): Promise<any> {
        const tokenPile = await player.chooseGain(Texts.whereWantXToken('+$1'), false, GainRestrictions.instance().setMustIncludeType('action').setIsAvailable(false), 'none');
        if (tokenPile) {
            player.data.tokens.extraMoney = tokenPile.getPileIdentifier();
        }
    }
}