import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import {GainRestrictions} from "../../server/GainRestrictions";

export default class Squire extends Card {
    intrinsicTypes = ["action"] as const;
    name = "squire";
    intrinsicCost = {
        coin: 2
    };
    cardText = "+$1\n" +
        "Choose one: +2 Actions; or +2 Buys; or gain a Silver.\n" +
        "---\n" +
        "When you trash this, gain an Attack card.";
    supplyCount = 10;
    cardArt = "/img/card-img/SquireArt.jpg";
    async onAction(player: Player): Promise<void> {
        player.data.money += 1;
        const choice = await player.chooseOption(Texts.chooseBenefitFor('squire'), [Texts.extraActions("2"), Texts.extraBuys("2"), Texts.gain(['silver'])] as const);
        switch (choice) {
            case Texts.extraActions("2"):
                player.data.actions += 2;
                break;
            case Texts.extraBuys("2"):
                player.data.buys += 2;
                break;
            case Texts.gain(['silver']):
                await player.gain('silver');
                break;
        }
    }
    async onTrashSelf(player: Player): Promise<void> {
        await player.chooseGain(Texts.chooseCardToGainFor('squire'), false, GainRestrictions.instance().setMustIncludeType("attack"));
    }
}
