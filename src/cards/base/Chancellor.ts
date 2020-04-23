import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Chancellor extends Card {
    intrinsicTypes = ["action"] as const;
    name = "chancellor";
    intrinsicCost = {
        coin: 3
    };
    cardText = "+$2\n" +
        "You may immediately put your deck into your discard pile.";
    supplyCount = 10;
    cardArt = "/img/card-img/ChancellorArt.jpg";
    async onAction(player: Player): Promise<void> {
        player.data.money += 2;
        if (await player.confirmAction(Texts.placeDeckIntoDiscard)) {
            player.lm('%p puts their deck into their discard.');
            player.deck.discard = [...player.deck.discard, ...player.deck.cards];
            player.deck.cards = [];
        }
    }
}