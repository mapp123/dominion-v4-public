import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class HuntingGrounds extends Card {
    intrinsicTypes = ["action"] as const;
    name = "hunting grounds";
    intrinsicCost = {
        coin: 6
    };
    cardText = "+4 Cards\n" +
        "---\n" +
        "When you trash this, gain a Duchy or 3 Estates.";
    supplyCount = 10;
    cardArt = "/img/card-img/686px-Hunting_GroundsArt.jpg";
    async onPlay(player: Player): Promise<void> {
        await player.draw(4);
    }
    async onTrashSelf(player: Player): Promise<void> {
        const choices = [Texts.gain(['duchy']), Texts.gain(['estate', 'estate', 'estate'])];
        const choice = await player.chooseOption(Texts.chooseBenefitFor('hunting grounds'), choices);
        switch (choice) {
            case choices[0]: // Gain a duchy
                await player.gain('duchy');
                break;
            case choices[1]:
                await player.gain('estate');
                await player.gain('estate');
                await player.gain('estate');
                break;
        }
    }
}
