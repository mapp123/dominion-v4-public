import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Storyteller extends Card {
    static descriptionSize = 55;
    intrinsicTypes = ["action"] as const;
    name = "storyteller";
    intrinsicCost = {
        coin: 5
    };
    cardText = "+1 Action\n" +
        "+$1\n" +
        "Play up to 3 Treasures from your hand. Then pay all of your $ (including the $1 from this) and draw a card per $1 you paid.";
    supplyCount = 10;
    cardArt = "/img/card-img/StorytellerArt.jpg";
    async onPlay(player: Player): Promise<void> {
        player.data.actions++;
        player.data.money++;
        for (let i = 0; i < 3; i++) {
            const card = await player.chooseCardFromHand(Texts.chooseCardToPlayFor(this.name), true, (card) => card.types.includes("treasure"));
            if (card == null) {
                break;
            }
            player.data.playArea.push(card);
            await player.playCard(card, null);
        }
        await player.draw(player.data.money);
        player.data.money = 0;
    }
}
