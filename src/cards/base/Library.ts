import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";

export default class Library extends Card {
    intrinsicTypes = ["action"] as const;
    name = "library";
    intrinsicCost = {
        coin: 5
    };
    cardText = "Draw until you have 7 cards in hand, skipping any Action cards you choose to; set those aside, discarding them afterwards.";
    supplyCount = 10;
    cardArt = "/img/card-img/LibraryArt.jpg";
    async onAction(player: Player): Promise<void> {
        let nextCard: Card | undefined;
        const setAside: Card[] = [];
        while (player.data.hand.length < 7 && (nextCard = await player.deck.pop()) != null) {
            if (nextCard.types.includes("action") && !await player.confirmAction(Texts.wantToDraw(nextCard.name))) {
                setAside.push(nextCard);
                player.lm('%p sets aside %s.', Util.formatCardList([nextCard.name]));
            }
            else {
                player.data.hand.push(nextCard);
            }
        }
        await player.discard(setAside);
    }
}
