import type Player from "../../server/Player";
import Event from "../Event";
import {Texts} from "../../server/Texts";
import {GainRestrictions} from "../../server/GainRestrictions";

export default class Pathfinding extends Event {
    cardArt = "/img/card-img/PathfindingArt.jpg";
    cardText = "Move your +1 Card token to an Action Supply pile. (When you play a card from that pile, you first get+1 Card.)";
    intrinsicCost = {
        coin: 8
    };
    name = "pathfinding";
    async onPurchase(player: Player): Promise<any> {
        const pile = await player.chooseGain(Texts.whereWantXToken('+1 Card'), false, GainRestrictions.instance().setMustIncludeType('action').setIsAvailable(false), 'none');
        if (pile) {
            player.data.tokens.extraCard = pile.getPileIdentifier();
        }
    }
}