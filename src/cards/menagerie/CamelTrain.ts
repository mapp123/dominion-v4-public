import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import {GainRestrictions} from "../../server/GainRestrictions";

export default class CamelTrain extends Card {
    intrinsicTypes = ["action"] as const;
    name = "camel train";
    intrinsicCost = {
        coin: 3
    };
    cardText = "Exile a non-Victory card from the Supply.\n" +
        "---\n" +
        "When you gain this, Exile a Gold from the Supply.";
    supplyCount = 10;
    cardArt = "/img/card-img/Camel_TrainArt.jpg";
    features = ["exile"] as const;
    async onPlay(player: Player): Promise<void> {
        const card = await player.chooseGain(Texts.chooseCardToExileFor('camel train'), false, GainRestrictions.instance().addBannedType('victory'), 'none');
        if (card) {
            const grabbed = player.game.grabCard(card.id, 'supply');
            if (grabbed) {
                player.lm('%p exiles %l.', [grabbed]);
                player.data.exile.push(grabbed);
            }
        }
    }
    onGainSelf(player: Player): Promise<void> | void {
        const card = player.game.grabNameFromSupply('gold');
        if (card) {
            player.lm('%p exiles a gold from the supply.');
            player.data.exile.push(card);
        }
    }
}
