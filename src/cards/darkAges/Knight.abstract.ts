import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Tracker from "../../server/Tracker";
import Util from "../../Util";

export default abstract class Knight extends Card {
    intrinsicCost = {
        coin: 5
    };
    supplyCount = 0;
    randomizable = false;
    public static createSupplyPiles() {
        return [];
    }
    abstract async beforeKnight(player: Player, exemptPlayers: Player[], tracker: Tracker<this>): Promise<void>;
    async onAction(player: Player, exemptPlayers: Player[], tracker: Tracker<this>): Promise<void> {
        await this.beforeKnight(player, exemptPlayers, tracker);
        let trashSelf = false;
        await player.attackOthers(exemptPlayers, async (p) => {
            let revealed = [await p.deck.pop(), await p.deck.pop()].filter(Util.nonNull);
            revealed = await p.reveal(revealed);
            const trashable = revealed.filter((a) => {
                const b = p.game.getCostOfCard(a.name).coin;
                return b >= 3 && b <= 6;
            });
            const card = await p.chooseCard(Texts.chooseCardToTrashFor(this.name), trashable);
            if (card) {
                revealed.splice(revealed.indexOf(card), 1);
                await p.trash(card);
                if (card.types.includes("knight")) {
                    trashSelf = true;
                }
            }
            await p.discard(revealed);
        });
        if (trashSelf && tracker.hasTrack) {
            await player.trash(tracker.exercise()!);
        }
    }
}
