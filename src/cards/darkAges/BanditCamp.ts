import Card from "../Card";
import type Player from "../../server/Player";

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
    async onPlay(player: Player): Promise<void> {
        await player.draw(1, true);
        player.data.actions += 2;
        await player.gain('spoils');
    }
    static onChosen() {
        return [
            'spoils'
        ];
    }
}
