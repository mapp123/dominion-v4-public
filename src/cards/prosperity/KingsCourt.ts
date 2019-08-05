import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";

export default class KingsCourt extends Card {
    types = ["action"] as const;
    name = "king's court";
    cost = {
        coin: 7
    };
    cardText = "You may play an Action card from your hand three times.";
    supplyCount = 10;
    cardArt = "/img/card-img/Kings_CourtArt.jpg";
    private _duplicateCard1: Card | null = null;
    private _duplicateCard2: Card | null = null;
    private _isUnderThroneRoom: boolean = false;
    async onAction(player: Player): Promise<void> {
        const card = await player.chooseCardFromHand(Texts.chooseCardToPlayThrice, true, (card) => card.types.includes('action'));
        if (card) {
            player.lm('%p chooses %s.', Util.formatCardList([card.name]));
            player.data.playArea.push(card);
            await player.playActionCard(card);
            // We create a duplicate card with the same ID, and call it's play function. This way, it can find itself,
            // but have an independent version of data and everything else.
            // @ts-ignore
            this._duplicateCard1 = new card.constructor(this.game) as Card;
            this._duplicateCard1.id = card.id;
            if (typeof (this._duplicateCard1 as any)._isUnderThroneRoom !== "undefined") {
                (this._duplicateCard1 as any)._isUnderThroneRoom = true;
            }
            player.lm('%p replays the %s.', card.name);
            await player.playActionCard(this._duplicateCard1, false);
            // @ts-ignore
            this._duplicateCard2 = new card.constructor(this.game) as Card;
            this._duplicateCard2.id = card.id;
            if (typeof (this._duplicateCard2 as any)._isUnderThroneRoom !== "undefined") {
                (this._duplicateCard2 as any)._isUnderThroneRoom = true;
            }
            player.lm('%p replays the %s.', card.name);
            await player.playActionCard(this._duplicateCard2, false);
        }
    }
    shouldDiscardFromPlay(): boolean {
        if (this._isUnderThroneRoom) {
            return true;
        }
        if (this._duplicateCard1) {
            return this._duplicateCard1.shouldDiscardFromPlay();
        }
        return true;
    }
    async onDiscardFromPlay(player: Player): Promise<any> {
        this._isUnderThroneRoom = false;
        if (this._duplicateCard1) {
            await this._duplicateCard1.onDiscardFromPlay(player);
        }
        this._duplicateCard1 = null;
    }
}
