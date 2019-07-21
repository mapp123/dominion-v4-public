import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Chancellor extends Card {
    types = ["action"] as const;
    name = "chancellor";
    cost = {
        coin: 3
    };
    cardText = "+$2\n" +
        "You may immediately put your deck into your discard pile.";
    supplyCount = 10;
    async onAction(player: Player): Promise<void> {
        player.data.money += 2;
        if (await player.confirmAction(Texts.placeDeckIntoDiscard)) {
            player.lm('%p puts their deck into their discard.');
            player.deck.discard = [...player.deck.discard, ...player.deck.cards];
            player.deck.cards = [];
        }
    }
}