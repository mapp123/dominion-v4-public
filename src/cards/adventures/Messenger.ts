import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import {GainRestrictions} from "../../server/GainRestrictions";
import Cost from "../../server/Cost";

export default class Messenger extends Card {
    static descriptionSize = 48;
    intrinsicTypes = ["action"] as const;
    name = "messenger";
    intrinsicCost = {
        coin: 4
    };
    cardText = "+1 Buy\n" +
        "+$2\n" +
        "You may put your deck into your discard pile.\n" +
        "---\n" +
        "When this is your first buy in a turn, gain a card costing up to $4, and each other player gains a copy of it.";
    supplyCount = 10;
    cardArt = "/img/card-img/MessengerArt.jpg";
    async onAction(player: Player): Promise<void> {
        player.data.buys++;
        player.data.money += 2;
        if (await player.confirmAction(Texts.placeDeckIntoDiscard)) {
            player.lm('%p puts their deck into their discard.');
            player.deck.discard = [...player.deck.discard, ...player.deck.cards];
            player.deck.cards = [];
        }
    }
    public static async onBuy(player: Player): Promise<Card | null> {
        const ret = await player.gain(this.cardName, undefined, false);
        if (player.boughtCards.filter((a) => a.isCard).length === 0) {
            const card = await player.chooseGain(Texts.chooseCardToGainFor('messenger'), false, GainRestrictions.instance().setUpToCost(Cost.create(4)));
            if (!card) return ret;
            for (const p of player.game.players) {
                if (p === player) continue;
                await p.gain(card.name);
            }
        }
        return ret;
    }
}
