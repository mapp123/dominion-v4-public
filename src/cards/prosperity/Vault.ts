import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Vault extends Card {
    intrinsicTypes = ["action"] as const;
    name = "vault";
    intrinsicCost = {
        coin: 5
    };
    cardText = "+2 Cards\n" +
        "Discard any number of cards for +$1 each.\n" +
        "Each other player may discard 2 cards, to draw a card.";
    supplyCount = 10;
    cardArt = "/img/card-img/VaultArt.jpg";
    async onPlay(player: Player): Promise<void> {
        await player.draw(2, true);
        let card: Card | null;
        while ((card = await player.chooseCardFromHand(Texts.discardForBenefit('+1 Money', 1), true)) != null) {
            await player.discard(card, true);
            await player.addMoney(1);
        }
        await player.affectOthers(async (p) => {
            const card = await p.chooseCardFromHand(Texts.discardForBenefit('to draw a card', 2), true);
            if (card != null) {
                await p.discard(card, true);
                const card2 = await p.chooseCardFromHand(Texts.discardForBenefit('to draw a card', 1));
                if (card2) {
                    await p.discard(card2, true);
                    await p.draw(1, false);
                }
            }
        });
    }
}
