import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Scepter extends Card {
    intrinsicTypes = ["treasure"] as const;
    name = "scepter";
    cost = {
        coin: 5
    };
    cardText = "When you play this, choose one: $2; or replay an Action card you played this turn that's still in play.";
    supplyCount = 10;
    cardArt = "/img/card-img/ScepterArt.jpg";
    private _duplicateCard: Card | null = null;
    private _isUnderThroneRoom: boolean = false;
    async onTreasure(player: Player): Promise<void> {
        const choice = await player.chooseOption(Texts.chooseBenefitFor('scepter'), [Texts.extraMoney("2"), Texts.replayAction] as const);
        switch (choice) {
            case Texts.extraMoney("2"):
                player.data.money += 2;
                break;
            case Texts.replayAction:
                const card = await player.chooseCard(Texts.chooseCardToReplay, player.data.playArea.filter((a) => a.types.includes("action")));
                if (card) {
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
                break;
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

    async onDiscardFromPlay(player: Player, hasTrack: { hasTrack: boolean }, loseTrack: () => {}): Promise<any> {
        this._isUnderThroneRoom = false;
        if (this._duplicateCard) {
            await this._duplicateCard.onDiscardFromPlay(player, hasTrack, loseTrack);
        }
        this._duplicateCard = null;
    }
}
