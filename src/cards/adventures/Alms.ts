import type Player from "../../server/Player";
import Event from "../Event";
import {Texts} from "../../server/Texts";
import Cost from "../../server/Cost";
import {GainRestrictions} from "../../server/GainRestrictions";

export default class Alms extends Event {
    cardArt = "/img/card-img/AlmsArt.jpg";
    cardText = "Once per turn: If you have no Treasures in play, gain a card costing up to $4.";
    intrinsicCost = {
        coin: 0
    };
    name = "alms";
    static oncePerTurn = true;
    async onPurchase(player: Player): Promise<any> {
        if (player.data.playArea.every((a) => !a.types.includes("treasure"))) {
            await player.chooseGain(Texts.chooseCardToGainFor('alms'), false, GainRestrictions.instance().setUpToCost(Cost.create(4)));
        }
    }
}