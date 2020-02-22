import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Amulet extends Card {
    intrinsicTypes = ["action","duration"] as const;
    name = "amulet";
    intrinsicCost = {
        coin: 3
    };
    cardText = "Now and at the start of your next turn, choose one: +$1; or trash a card from your hand; or gain a Silver.";
    supplyCount = 10;
    cardArt = "/img/card-img/AmuletArt.jpg";
    private isNextTurn = false;
    async onAction(player: Player): Promise<void> {
        this.isNextTurn = false;
        await this.doEffect(player);
        player.effects.setupEffect('turnStart', 'amulet', {
            teacher: true
        }, async (unsub) => {
            await this.doEffect(player);
            this.isNextTurn = true;
            unsub();
        });
    }
    shouldDiscardFromPlay(): boolean {
        return this.isNextTurn;
    }
    async doEffect(player: Player) {
        const effect = await player.chooseOption(Texts.chooseBenefitFor('amulet'), [Texts.extraMoney('1'), Texts.trashA('card from your hand'), Texts.gain(['silver'])]);
        switch (effect) {
            case Texts.extraMoney('1'):
                player.data.money++;
                break;
            case Texts.trashA('card from your hand'):
                const card = await player.chooseCardFromHand(Texts.chooseCardToTrashFor('amulet'));
                if (card) await player.trash(card);
                break;
            case Texts.gain(['silver']):
                await player.gain('silver');
                break;
        }
    }
}
