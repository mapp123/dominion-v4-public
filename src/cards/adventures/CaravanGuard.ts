import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import type Game from "../../server/Game";

export default class CaravanGuard extends Card {
    static descriptionSize = 50;
    static typelineSize = 39;
    intrinsicTypes = ["action","duration","reaction"] as const;
    name = "caravan guard";
    intrinsicCost = {
        coin: 3
    };
    cardText = "+1 Card\n" +
        "+1 Action\n" +
        "At the start of your next turn, +$1.\n" +
        "---\n" +
        "When another player plays an Attack card, you may first play this from your hand.\n";
    supplyCount = 10;
    cardArt = "/img/card-img/Caravan_GuardArt.jpg";
    private isNextTurn = false;
    async onPlay(player: Player): Promise<void> {
        this.isNextTurn = false;
        await player.draw(1, true);
        player.data.actions++;
        player.effects.setupEffect('turnStart', 'caravan guard', {
            compatibility: () => true
        }, async (unsub) => {
            this.isNextTurn = true;
            await player.addMoney(1);
            unsub();
        });
    }
    shouldDiscardFromPlay(): boolean {
        return this.isNextTurn;
    }
    async onAttackInHand(player: Player, attacker: Player, attackingCard: Card): Promise<boolean> {
        const myData = player.game.supply.getMyUnsyncedCardData(this);
        if ((myData[0] != attacker || myData[1] != attackingCard) && await player.confirmAction(Texts.doYouWantToPlay('caravan guard'))) {
            player.data.hand.splice(player.data.hand.indexOf(this), 1);
            player.data.playArea.push(this);
            player.lm('%p reveals and plays a caravan guard.');
            await player.playCard(this, player.getTrackerInPlay(this), false);
        }
        else {
            player.game.supply.setMyUnsyncedCardData(this, [attacker, attackingCard]);
        }
        return false;
    }
    static setup(data: any, game: Game) {
        game.supply.setMyUnsyncedCardData(this.cardName, [null, null]);
    }
}
