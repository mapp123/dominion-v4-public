import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Bureaucrat extends Card {
    types = ["action","attack"] as const;
    name = "bureaucrat";
    cost = {
        coin: 4
    };
    cardText = "Gain a Silver onto your deck. Each other player reveals a Victory card from their hand and puts it onto their deck (or reveals a hand with no Victory cards).";
    supplyCount = 10;
    cardArt = "/img/card-img/BureaucratArt.jpg";
    async onAction(player: Player, exemptPlayers: Player[]): Promise<void> {
        if (await player.gain('silver', undefined, 'deck')) {
            player.lm('%p gains a silver.');
        }
        await player.attackOthersInOrder(exemptPlayers, async (p) => {
            const card = await p.chooseCardFromHand(Texts.chooseVictoryToTopDeckFor('bureaucrat'), false, (card) => card.types.includes("victory"));
            if (card) {
                p.lm('%p puts a %c on top of their deck.', card.name);
                p.deck.cards.unshift(card);
            }
        });
    }
}
