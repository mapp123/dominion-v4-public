import Card from "../Card";
import type Player from "../../server/Player";
import type Inheritance from "../adventures/Inheritance";
import Tracker from "../../server/Tracker";

export default class Estate extends Card {
    intrinsicTypes = ["victory"] as const;
    name = "estate";
    intrinsicCost = {
        coin: 2
    };
    cardText = "1 VP";
    randomizable = false;
    cardArt = "/img/card-img/EstateArt.jpg";
    supplyCount = (players) => players < 3 ? 8 : 12;
    static onScore(player: Player): number {
        return player.allCards.filter((a) => a.name === "estate").length;
    }
    async onPlay(player: Player, exemptPlayers, tracker): Promise<void> {
        if (player.data.tokens.estate) {
            const card = await ((player.game.getCard('inheritance') as typeof Inheritance).getInstance(player) as Inheritance)
                .cardHolder.get(player.id)!.getCards()[0];
            const tracker = new Tracker(card);
            tracker.loseTrack();
            player.lm('(Inheritance plays %l.)', [card]);
            await player.playCard(card, tracker, false);
        }
        else {
            await super.onPlay(player, exemptPlayers, tracker);
        }
    }
}