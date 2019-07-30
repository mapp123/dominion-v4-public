import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Library extends Card {
    types = ["action"] as const;
    name = "library";
    cost = {
        coin: 5
    };
    cardText = "Draw until you have 7 cards in hand, skipping any Action cards you choose to; set those aside, discarding them afterwards.";
    supplyCount = 10;
    cardArt = "/img/card-img/LibraryArt.jpg";
    async onAction(player: Player): Promise<void> {
        let nextCard: Card | undefined;
        let setAside: Card[] = [];
        while (player.data.hand.length < 7 && (nextCard = player.deck.pop()) != null) {
            if (nextCard.types.includes("action") && !await player.confirmAction(Texts.wantToDraw(nextCard.name))) {
                setAside.push(nextCard);
                player.lm('%p sets aside a %s.', nextCard.name);
            }
            else {
                player.data.hand.push(nextCard);
            }
        }
        await player.discard(setAside);
    }
}