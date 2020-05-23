import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Scrap extends Card {
    intrinsicTypes = ["action"] as const;
    name = "scrap";
    intrinsicCost = {
        coin: 3
    };
    cardText = "Trash a card from your hand. Choose a different thing per $1 it costs: +1 Card; +1 Action; +1 Buy; +$1; gain a Silver; gain a Horse.";
    supplyCount = 10;
    cardArt = "/img/card-img/ScrapArt.jpg";
    static onChosen() {
        return ['horse'];
    }
    async onPlay(player: Player): Promise<void> {
        const card = await player.chooseCardFromHand(Texts.chooseCardToTrashFor('scrap'));
        if (card) {
            await player.trash(card);
            let amount = card.cost.coin;
            const benefits = [Texts.plusOneCard, Texts.plusOneAction, Texts.plusOneBuy, Texts.plusOneMoney, Texts.gain(['silver']), Texts.gain(['horse'])];
            while (amount > 0 && benefits.length > 0) {
                const benefit = await player.chooseOption(Texts.chooseXBenefitsFor(Math.min(amount, benefits.length), 'scrap'), benefits);
                benefits.splice(benefits.indexOf(benefit), 1);
                amount--;
                switch (benefit) {
                    case Texts.plusOneCard:
                        await player.draw(1, true);
                        break;
                    case Texts.plusOneAction:
                        player.data.actions++;
                        break;
                    case Texts.plusOneBuy:
                        player.data.buys++;
                        break;
                    case Texts.plusOneMoney:
                        await player.addMoney(1);
                        break;
                    case Texts.gain(['silver']):
                        await player.gain('silver');
                        break;
                    case Texts.gain(['horse']):
                        await player.gain('horse');
                        break;
                }
            }
        }
    }
}
