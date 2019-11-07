import Knight from "./Knight.abstract";
import Player from "../../server/Player";

export default class DameJosephine extends Knight {
    static descriptionSize = 54;
    static typelineSize = 39;
    async beforeKnight(): Promise<void> {

    }
    static onScore(player: Player): number {
        return player.allCards.filter((a) => a.name === "dame josephine").length * 2;
    }
    intrinsicTypes = ["action","attack","knight","victory"] as const;
    name = "dame josephine";
    cardText = "Each other player reveals the top 2 cards of their deck, trashes one of them costing from $3 to $6, and discards the rest. If a Knight is trashed by this, trash this.\n" +
        "---\n" +
        "2 VP";
    cardArt = "/img/card-img/Dame_JosephineArt.jpg";
    cost = {
        coin: 5
    };
}
