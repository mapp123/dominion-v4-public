import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";

export default class KingsCourt extends Card {
    intrinsicTypes = ["action"] as const;
    name = "king's court";
    intrinsicCost = {
        coin: 7
    };
    cardText = "You may play an Action card from your hand three times.";
    supplyCount = 10;
    cardArt = "/img/card-img/Kings_CourtArt.jpg";
    private _originalCard: Card | null = null;
    private _duplicateCard1: Card | null = null;
    private _duplicateCard2: Card | null = null;
    private _isUnderThroneRoom = false;
    async onAction(player: Player): Promise<void> {
        const card = await player.chooseCardFromHand(Texts.chooseCardToPlayThrice, true, (card) => card.types.includes('action'));
        if (card) {
            player.lm('%p chooses %s.', Util.formatCardList([card.name]));
            player.data.playArea.push(card);
            this._originalCard = card;
            const tracker = player.getTrackerInPlay(card);
            await player.playActionCard(card, tracker);
            this._duplicateCard1 = await player.replayActionCard(card, tracker);
            this._duplicateCard2 = await player.replayActionCard(card, tracker);
        }
    }
    shouldDiscardFromPlay(): boolean {
        if (this._originalCard && this._duplicateCard1 && this._duplicateCard2) {
            return [this._originalCard.shouldDiscardFromPlay(), this._duplicateCard1.shouldDiscardFromPlay(), this._duplicateCard2.shouldDiscardFromPlay()].filter((a) => a).length >= 2;
        }
        return true;
    }

    async onDiscardFromPlay(): Promise<any> {
        this._isUnderThroneRoom = false;
    }
}
