import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Moat extends Card {
    intrinsicTypes = ["action", "reaction"] as const;
    name = "moat";
    intrinsicCost = {
        coin: 2
    };
    cardText = "+2 Cards\n" +
        "---\n" +
        "When another player plays an Attack card, you may first reveal this from your hand, to be unaffected by it.";
    supplyCount = 10;
    cardArt = "/img/card-img/MoatArt.jpg";
    async onPlay(player: Player): Promise<void> {
        await player.draw(2);
    }
    async onAttackInHand(player: Player, attacker: Player, attackingCard: Card, playerAlreadyExempt: boolean): Promise<boolean> {
        if (playerAlreadyExempt) {
            return true;
        }
        return player.confirmAction(Texts.doYouWantToReveal('moat'));
    }
}