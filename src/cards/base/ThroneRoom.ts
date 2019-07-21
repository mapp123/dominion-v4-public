import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class ThroneRoom extends Card {
    types = ["action"] as const;
    name = "throne room";
    cost = {
        coin: 4
    };
    cardText = "You may play an Action card from your hand twice.";
    supplyCount = 10;
    private _duplicateCard: Card | null = null;
    private _isUnderThroneRoom: boolean = false;
    async onAction(player: Player): Promise<void> {
        const card = await player.chooseCardFromHand(Texts.chooseCardToPlayTwice, true, (card) => card.types.includes('action'));
        if (card) {
            player.lm('%p chooses a %s.', card.name);
            player.data.playArea.push(card);
            await player.playActionCard(card);
            // We create a duplicate card with the same ID, and call it's play function. This way, it can find itself,
            // but have an independent version of data and everything else.
            // @ts-ignore
            this._duplicateCard = new card.constructor(this.game) as Card;
            this._duplicateCard.id = card.id;
            if (typeof (this._duplicateCard as any)._isUnderThroneRoom !== "undefined") {
                (this._duplicateCard as any)._isUnderThroneRoom = true;
            }
            player.lm('%p replays the %s.', card.name);
            await player.playActionCard(this._duplicateCard, false);
        }
    }
    shouldDiscardFromPlay(): boolean {
        if (this._isUnderThroneRoom) {
            return true;
        }
        if (this._duplicateCard) {
            return this._duplicateCard.shouldDiscardFromPlay();
        }
        return true;
    }
    async onDiscardFromPlay(player: Player): Promise<any> {
        this._isUnderThroneRoom = false;
        if (this._duplicateCard) {
            await this._duplicateCard.onDiscardFromPlay(player);
        }
        this._duplicateCard = null;
    }
}