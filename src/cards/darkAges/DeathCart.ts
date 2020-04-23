import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";

export default class DeathCart extends Card {
    intrinsicTypes = ["action","looter"] as const;
    name = "death cart";
    intrinsicCost = {
        coin: 4
    };
    cardText = "You may trash this or an Action card from your hand, for +$5.\n" +
        "---\n" +
        "When you gain this, gain 2 Ruins.";
    supplyCount = 10;
    cardArt = "/img/card-img/800px-Death_CartArt.jpg";
    async onAction(player: Player, exemptPlayers, tracker): Promise<void> {
        const card = await player.chooseCard(Texts.trashForBenefit('+$5', 1), [...player.data.hand, tracker.hasTrack ? tracker.viewCard() : null].filter(Util.nonNull), true, (card) => card.types.includes("action"), true);
        if (card) {
            if (card.id === tracker.viewCard().id) {
                await player.trash(tracker.exercise());
            }
            else {
                const c = player.data.hand.splice(player.data.hand.findIndex((a) => a.id === card.id), 1)[0];
                await player.trash(c);
            }
            player.data.money += 5;
        }
    }
    async onGainSelf(player: Player): Promise<void> {
        await player.gain('ruins');
        await player.gain('ruins');
    }
}
