import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";

export default class ThroneRoom extends Card {
    intrinsicTypes = ["action"] as const;
    name = "throne room";
    intrinsicCost = {
        coin: 4
    };
    cardText = "You may play an Action card from your hand twice.";
    supplyCount = 10;
    cardArt = "/img/card-img/Throne_RoomArt.jpg";
    private _originalCard: Card | null = null;
    private _duplicateCard: Card | null = null;
    async onAction(player: Player): Promise<void> {
        const card = await player.chooseCardFromHand(Texts.chooseCardToPlayTwice, true, (card) => card.types.includes('action'));
        if (card) {
            player.lm('%p chooses %s.', Util.formatCardList([card.name]));
            player.data.playArea.push(card);
            this._originalCard = card;
            const tracker = player.getTrackerInPlay(card);
            await player.playActionCard(card, tracker);
            this._duplicateCard = await player.replayActionCard(card, tracker);
        }
    }
    shouldDiscardFromPlay(): boolean {
        if (this._originalCard && this._duplicateCard) {
            return this._originalCard.shouldDiscardFromPlay() || this._duplicateCard.shouldDiscardFromPlay();
        }
        return true;
    }

    async onDiscardFromPlay(): Promise<any> {
        // The duplicate does not get an on-discard-from-play because it can't actually be discarded -- it's virtual
        this._duplicateCard = null;
    }
}