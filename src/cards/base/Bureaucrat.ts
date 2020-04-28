import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";

export default class Bureaucrat extends Card {
    intrinsicTypes = ["action","attack"] as const;
    name = "bureaucrat";
    intrinsicCost = {
        coin: 4
    };
    cardText = "Gain a Silver onto your deck. Each other player reveals a Victory card from their hand and puts it onto their deck (or reveals a hand with no Victory cards).";
    supplyCount = 10;
    cardArt = "/img/card-img/BureaucratArt.jpg";
    async onPlay(player: Player, exemptPlayers: Player[]): Promise<void> {
        await player.gain('silver', undefined, true, 'deck');
        await player.attackOthersInOrder(exemptPlayers, async (p) => {
            const card = await p.chooseCardFromHand(Texts.chooseVictoryToTopDeckFor('bureaucrat'), false, (card) => card.types.includes("victory"));
            if (card) {
                const tracker = await p.revealWithTracker([card]);
                if (tracker[0].hasTrack) {
                    p.lm('%p puts %ac on top of their deck.', Util.formatCardList([card.name]));
                    p.deck.cards.unshift(tracker[0].exercise()!);
                }
            }
            else {
                await p.revealHand();
            }
        });
    }
}
