import type Player from "../../server/Player";
import Knight from "./Knight.abstract";
import {Texts} from "../../server/Texts";
import type Card from "../Card";

export default class DameAnna extends Knight {
    static descriptionSize = 55;
    static typelineSize = 47;
    intrinsicTypes = ["action", "attack", "knight"] as const;
    name = "dame anna";
    cardText = "You may trash up to 2 cards from your hand. Each other player reveals the top 2 cards of their deck, trashes one of them costing from $3 to $6, and discards the rest. If a Knight is trashed by this, trash this.";
    cardArt = "/img/card-img/Dame_AnnaArt.jpg";
    async beforeKnight(player: Player): Promise<void> {
        let trashed = 0;
        let card: Card | null;
        while (trashed < 2 && (card = await player.chooseCardFromHand(Texts.chooseCardToTrashFor('dame anna'), true)) != null) {
            await player.trash(card);
            trashed++;
        }
    }
}
