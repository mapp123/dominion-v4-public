import Card from "../Card";
import type Player from "../../server/Player";

export default class Relic extends Card {
    intrinsicTypes = ["treasure","attack"] as const;
    name = "relic";
    intrinsicCost = {
        coin: 5
    };
    cardText = "$2\n" +
        "When you play this, each other player puts their –1 Card token on their deck.";
    supplyCount = 10;
    cardArt = "/img/card-img/RelicArt.jpg";
    async onPlay(player: Player, exemptPlayers: Player[]): Promise<void> {
        await player.addMoney(2);
        await player.attackOthers(exemptPlayers, async (p) => {
            if (!p.data.tokens.minusOneCard) {
                p.lm('%p takes their -1 Card token.');
                p.data.tokens.minusOneCard = true;
            }
        });
    }
}
