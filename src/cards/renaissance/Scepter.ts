import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Scepter extends Card {
    intrinsicTypes = ["treasure"] as const;
    name = "scepter";
    intrinsicCost = {
        coin: 5
    };
    cardText = "When you play this, choose one: $2; or replay an Action card you played this turn that's still in play.";
    supplyCount = 10;
    cardArt = "/img/card-img/ScepterArt.jpg";
    private _duplicateCard: Card | null = null;
    private _isUnderThroneRoom = false;
    intrinsicValue = 2;
    async onTreasure(player: Player): Promise<void> {
        const choice = await player.chooseOption(Texts.chooseBenefitFor('scepter'), [Texts.extraMoney("2"), Texts.replayAction] as const);
        switch (choice) {
            case Texts.extraMoney("2"):
                player.data.money += 2;
                break;
            case Texts.replayAction:
                const card = await player.chooseCard(Texts.chooseCardToReplay, player.data.playArea.filter((a) => a.types.includes("action")));
                if (card) {
                    this._duplicateCard = await player.replayActionCard(card, player.getTrackerInPlay(card), true);
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

    async onDiscardFromPlay(): Promise<any> {
        this._isUnderThroneRoom = false;
    }
}
