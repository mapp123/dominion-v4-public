import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Miser extends Card {
    intrinsicTypes = ["action"] as const;
    name = "miser";
    intrinsicCost = {
        coin: 4
    };
    features = ["tavernMat"] as const;
    cardText = "Choose one: Put a Copper from your hand onto your Tavern mat; or +$1 per Copper on your Tavern mat.";
    supplyCount = 10;
    cardArt = "/img/card-img/MiserArt.jpg";
    async onPlay(player: Player): Promise<void> {
        const coins = player.data.tavernMat.filter((a) => a.card.name === 'copper').length;
        const options = [Texts.putXOnTavernMap('copper from your hand'), Texts.extraMoney(coins + '')];
        const choice = await player.chooseOption(Texts.chooseBenefitFor('miser'), options);
        switch (choice) {
            case options[0]:
                const cardIndex = player.data.hand.findIndex((a) => a.name === 'copper');
                if (cardIndex === -1) {
                    player.lm('%p does not have a copper in their hand to put onto their tavern mat.');
                }
                else {
                    player.lm('%p puts a copper on their tavern mat.');
                    const card = player.data.hand.splice(cardIndex, 1)[0];
                    player.data.tavernMat.push({
                        card,
                        canCall: false
                    });
                }
                break;
            case options[1]:
                player.lm(`%p takes the money from miser. (+$${coins})`);
                await player.addMoney(coins);
                break;
        }
    }
}
