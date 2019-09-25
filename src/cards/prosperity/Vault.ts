import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Vault extends Card {
    intrinsicTypes = ["action"] as const;
    name = "vault";
    cost = {
        coin: 5
    };
    cardText = "+2 Cards\n" +
        "Discard any number of cards for +$1 each.\n" +
        "Each other player may discard 2 cards, to draw a card.";
    supplyCount = 10;
    cardArt = "/img/card-img/VaultArt.jpg";
    async onAction(player: Player): Promise<void> {
        await player.draw(2);
        let card: Card | null;
        while ((card = await player.chooseCardFromHand(Texts.discardForBenefit('+1 Money'), true)) != null) {
            await player.discard(card, true);
            player.data.money += 1;
        }
        await player.affectOthers(async (p) => {
            const card = await p.chooseCardFromHand(Texts.discardForBenefit('to draw a card', 2), true);
            if (card != null) {
                await p.discard(card, true);
                const card2 = await p.chooseCardFromHand(Texts.discardForBenefit('to draw a card'));
                if (card2) {
                    await p.discard(card2, true);
                    await p.draw();
                }
            }
        });
    }
}
