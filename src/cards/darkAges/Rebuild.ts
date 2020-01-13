import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import shuffle from "../../server/util/shuffle";
import Util from "../../Util";
import Tracker from "../../server/Tracker";
import {GainRestrictions} from "../../server/GainRestrictions";
import Cost from "../../server/Cost";

export default class Rebuild extends Card {
    static descriptionSize = 53;
    intrinsicTypes = ["action"] as const;
    name = "rebuild";
    intrinsicCost = {
        coin: 5
    };
    cardText = "+1 Action\n" +
        "Name a card. Reveal cards from your deck until you reveal a Victory card you did not name. Discard the rest, trash the Victory card, and gain a Victory card costing up to $3 more than it.";
    supplyCount = 10;
    cardArt = "/img/card-img/800px-RebuildArt.jpg";
    async onAction(player: Player): Promise<void> {
        player.data.actions += 1;
        const namedCard = await player.chooseCard(Texts.chooseCardToNameFor('rebuild'), shuffle(Util.deduplicateByName([...player.allCards, ...player.game.supply.data.piles.filter((a) => a.pile.length > 0 && a.pile[a.pile.length - 1].types.includes("victory")).map((a) => a.pile[a.pile.length - 1])])));
        if (namedCard) {
            const revealedArr: Array<Tracker<Card>> = [];
            let card: Array<Tracker<Card>>;
            while ((card = await player.revealTop(1)).length > 0) {
                if (card[0].viewCard().name !== namedCard.name && card[0].viewCard().types.includes("victory")) {
                    player.lm('%p reveals %s.', Util.formatCardList(revealedArr.map((a) => a.viewCard().name)));
                    player.lm('%p reveals %s.', Util.formatCardList([card[0].viewCard().name]));
                    if (card[0].hasTrack) {
                        await player.trash(card[0].exercise()!, true);
                    }
                    await player.chooseGain(Texts.chooseCardToGainFor('rebuild'), false, GainRestrictions.instance().setUpToCost(card[0].viewCard().cost.augmentBy(Cost.create(3))).setMustIncludeType('victory'));
                    await player.discard(revealedArr.filter((a) => a.hasTrack).map((a) => a.exercise()!));
                    return;
                }
                revealedArr.push(...card);
            }
            player.lm('%p reveals %s.', Util.formatCardList(revealedArr.map((a) => a.viewCard().name)));
            player.lm('%p runs out of cards to reveal.');
            await player.discard(revealedArr.filter((a) => a.hasTrack).map((a) => a.exercise()!));
        }
    }
}
