import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";

export default class Beggar extends Card {
    static descriptionSize = 59;
    intrinsicTypes = ["action", "reaction"] as const;
    name = "beggar";
    intrinsicCost = {
        coin: 2
    };
    cardText = "Gain 3 Coppers to your hand.\n" +
        "When another player plays an Attack card, you may first discard this to gain 2 Silvers, putting one onto your deck.";
    supplyCount = 10;
    cardArt = "/img/card-img/BeggarArt.jpg";
    async onAction(player: Player): Promise<void> {
        const cards = [
            await player.gain('copper', undefined, false, 'hand'),
            await player.gain('copper', undefined, false, 'hand'),
            await player.gain('copper', undefined, false, 'hand')
        ].filter(Util.nonNull);
        player.lm('%p gains %s.', Util.formatCardList(cards.map((a) => a.name)));
    }
    async onAttackInHand(player: Player, attacker: Player, attackingCard: Card): Promise<boolean> {
        if (await player.confirmAction(Texts.doYouWantToDiscardAnAForB('beggar', attackingCard.name))) {
            const card = player.data.hand.splice(player.data.hand.findIndex((a) => a.id === this.id), 1)[0];
            if (card) {
                await player.discard(card, true);
                const cards = [
                    await player.gain('silver', undefined, false, 'deck'),
                    await player.gain('silver', undefined, false)
                ].filter(Util.nonNull);
                player.lm('%p gains %s.', Util.formatCardList(cards.map((a) => a.name)));
            }
        }
        return false;
    }
}
