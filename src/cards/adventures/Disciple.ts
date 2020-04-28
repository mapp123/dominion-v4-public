import type Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Traveller from "./Traveller.abstract";
import Util from "../../Util";

export default class Disciple extends Traveller {
    static descriptionSize = 51;
    static typelineSize = 63;
    intrinsicTypes = ["action","traveller"] as const;
    name = "disciple";
    intrinsicCost = {
        coin: 5
    };
    cardText = "You may play an Action card from your hand twice. Gain a copy of it.\n" +
        "---\n" +
        "When you discard this from play, you may exchange it for a Teacher.\n" +
        "(This is not in the Supply.)";
    supplyCount = 10;
    cardArt = "/img/card-img/DiscipleArt.jpg";
    travellerTarget = "teacher";
    private _originalCard: Card | null = null;
    private _duplicateCard: Card | null = null;
    randomizable = false;
    static inSupply = false;
    async onAction(player: Player): Promise<void> {
        const card = await player.chooseCardFromHand(Texts.chooseCardToPlayTwice, true, (card) => card.types.includes('action'));
        if (card) {
            this._originalCard = card;
            player.lm('%p chooses %s.', Util.formatCardList([card.name]));
            player.data.playArea.push(card);
            const tracker = player.getTrackerInPlay(card);
            await player.playActionCard(card, tracker);
            this._duplicateCard = await player.replayActionCard(card, tracker);
            if ((card.constructor as typeof Card).inSupply) {
                await player.gain(card.name);
            }
        }
    }
    shouldDiscardFromPlay(): boolean {
        if (this._originalCard && this._duplicateCard) {
            return this._originalCard.shouldDiscardFromPlay() || this._duplicateCard.shouldDiscardFromPlay();
        }
        return true;
    }
}
