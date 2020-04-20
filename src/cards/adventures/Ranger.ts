import Card from "../Card";
import Player from "../../server/Player";

export default class Ranger extends Card {
    intrinsicTypes = ["action"] as const;
    name = "ranger";
    intrinsicCost = {
        coin: 4
    };
    tokens = ["journeyToken"] as const;
    cardText = "+1 Buy\n" +
        "Turn your Journey token over (it starts face up). Then if it's face up, +5 Cards.";
    supplyCount = 10;
    cardArt = "/img/card-img/RangerArt.jpg";
    async onAction(player: Player): Promise<void> {
        player.data.buys++;
        if (player.data.tokens.journeyToken === 'UP') {
            player.data.tokens.journeyToken = 'DOWN';
            // Ending face down, no benefit
        }
        else {
            player.data.tokens.journeyToken = 'UP';
            await player.draw(5);
        }
    }
}
