import type Player from "../../server/Player";
import Event from "../Event";
import type {GainRestrictions} from "../../server/GainRestrictions";

export default class Mission extends Event {
    cardArt = "/img/card-img/MissionArt.jpg";
    cardText = "Once per turn: If the previous turn wasn't yours, take another turn after this one, in which you can't buy cards.";
    intrinsicCost = {
        coin: 4
    };
    name = "mission";
    static oncePerTurn = true
    private isMissionTurn = false;
    async onPurchase(player: Player): Promise<any> {
        if (player.lastTurnMine) {
            player.lm('The last turn was %p\'s, so Mission has no effect.');
            return;
        }
        player.effects.setupEffect('afterTurn', this.name, {
            compatibility: {}
        }, async (remove) => {
            remove();
            this.isMissionTurn = true;
            await player.playTurn(" (Mission)");
            this.isMissionTurn = false;
        });
    }
    public static getExtraRestrictions(cardData: any, player: Player, restrictions: GainRestrictions): GainRestrictions {
        if (player.lastTurnMine) {
            restrictions.addBannedCard(this.cardName);
        }
        if ((this.getInstance(player) as Mission).isMissionTurn) {
            player.game.selectedCards.forEach((card) => {
                if (player.game.getCard(card).isCard) {
                    restrictions.addBannedCard(card);
                }
            });
        }
        return restrictions;
    }
}