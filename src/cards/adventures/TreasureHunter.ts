import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";
import Tracker from "../../server/Tracker";

export default class TreasureHunter extends Card {
    static descriptionSize = 50;
    intrinsicTypes = ["action","traveller"] as const;
    name = "treasure hunter";
    intrinsicCost = {
        coin: 3
    };
    cardText = "+1 Action\n" +
        "+$1\n" +
        "Gain a Silver per card the player to your right gained on their last turn.\n" +
        "---\n" +
        "When you discard this from play, you may exchange it for a Warrior.\n" +
        "(This is not in the Supply.)";
    supplyCount = 5;
    cardArt = "/img/card-img/Treasure_HunterArt.jpg";
    randomizable = false;
    static inSupply = false;
    async onAction(player: Player): Promise<void> {
        player.data.actions++;
        player.data.money += 1;
        if (player.game.players.length === 1) {
            return;
        }
        let lastPlayer = player.game.players.findIndex((a) => a.id === player.id) - 1;
        if (lastPlayer < 0) {
            lastPlayer += player.game.players.length;
        }
        const silversToGain = player.game.players[lastPlayer].gainedCards.length;
        const gained = [] as Card[];
        for (let i = 0; i < silversToGain; i++) {
            const card = await player.gain('silver', undefined, false);
            if (card) {
                gained.push(card);
            }
            else {
                break;
            }
        }
        player.lm('%p gains %s.', Util.formatCardList(gained.map((a) => a.name)));
    }
    async onDiscardFromPlay(player: Player, tracker: Tracker<Card>): Promise<any> {
        if (tracker.hasTrack && player.game.supply.getPile('warrior')!.length > 0 && await player.confirmAction(Texts.doYouWantToExchangeXForY('treasure hunter', 'warrior'))) {
            await player.lm('%p exchanges a treasure hunter for a warrior.');
            player.game.supply.getPile(this.name)!.push(tracker.exercise()!);
            player.deck.discard.push(player.game.grabNameFromSupply('warrior')!);
        }
    }
    public static onChosen() {
        return ['warrior'];
    }
}