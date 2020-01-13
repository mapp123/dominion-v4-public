import Card from "../Card";
import Player from "../../server/Player";

export default class BanditCamp extends Card {
    intrinsicTypes = ["action"] as const;
    name = "bandit camp";
    intrinsicCost = {
        coin: 5
    };
    cardText = "+1 Card\n" +
        "+2 Actions\n" +
        "Gain a Spoils from the Spoils pile.";
    supplyCount = 10;
    cardArt = "/img/card-img/Bandit_CampArt.jpg";
    async onAction(player: Player): Promise<void> {
        await player.draw();
        player.data.actions += 2;
        await player.gain('spoils');
    }
    static onChosen() {
        return [
            'spoils'
        ];
    }
}
