import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Scavenger extends Card {
    intrinsicTypes = ["action"] as const;
    name = "scavenger";
    intrinsicCost = {
        coin: 4
    };
    cardText = "+$2\n" +
        "You may put your deck into your discard pile. Look through your discard pile and put one card from it onto your deck.";
    supplyCount = 10;
    cardArt = "/img/card-img/ScavengerArt.jpg";
    async onPlay(player: Player): Promise<void> {
        player.data.money += 2;
        if (await player.confirmAction(Texts.placeDeckIntoDiscard)) {
            const cards = [...player.deck.cards];
            player.deck.cards = [];
            player.deck.discard = [...player.deck.discard, ...cards];
        }
        const card = await player.chooseCard(Texts.chooseCardToPutOnDeck, player.deck.discard.filter((a, i) => player.deck.discard.findIndex((b) => b.name === a.name) === i));
        if (card) {
            player.deck.discard.splice(player.deck.discard.findIndex((a) => a.id === card.id), 1);
            player.deck.cards.unshift(card);
        }
    }
}
