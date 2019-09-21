import Card from "../Card";
import Player from "../../server/Player";

export default class Swashbuckler extends Card {
    types = ["action"] as const;
    name = "swashbuckler";
    cost = {
        coin: 5
    };
    cardText = "+3 Cards\n" +
        "If your discard pile has any cards in it: \n" +
        "+1 Coffers,\n" +
        "then if you have at least 4 Coffers tokens, take the Treasure Chest.";
    features = ["coffers"] as const;
    supplyCount = 10;
    cardArt = "/img/card-img/800px-SwashbucklerArt.jpg";
    async onAction(player: Player): Promise<void> {
        await player.draw(3);
        if (player.deck.discard.length > 0) {
            player.data.coffers++;
            if (player.data.coffers >= 4) {
                player.game.giveArtifactTo('treasure chest', player);
            }
        }
    }
    static onChosen() {
        return ['treasure chest'];
    }
}
