import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Tracker from "../../server/Tracker";
import Util from "../../Util";
import Cost from "../../server/Cost";

export default abstract class Knight extends Card {
    intrinsicCost = {
        coin: 5
    };
    supplyCount = 0;
    randomizable = false;
    public static createSupplyPiles() {
        return [];
    }
    getPileIdentifier(): string {
        return 'knights';
    }
    abstract async beforeKnight(player: Player, exemptPlayers: Player[], tracker: Tracker<this>): Promise<void>;
    async onAction(player: Player, exemptPlayers: Player[], tracker: Tracker<this>): Promise<void> {
        await this.beforeKnight(player, exemptPlayers, tracker);
        let trashSelf = false;
        await player.attackOthers(exemptPlayers, async (p) => {
            const revealed = await p.revealTop(2, true);
            const lowerLimit = Cost.create(3);
            const upperLimit = Cost.create(6);
            const trashable = revealed.filter((a) => {
                return a.viewCard().cost.isInRange(lowerLimit, upperLimit);
            });
            const card = await p.chooseCard(Texts.chooseCardToTrashFor(this.name), trashable.map((a) => a.viewCard()));
            if (card) {
                const tracker = revealed.find((a) => a.viewCard().id === card.id)!;
                if (tracker.hasTrack) {
                    await p.trash(tracker.exercise()!);
                }
                if (card.types.includes("knight")) {
                    trashSelf = true;
                }
            }
            await p.discard(Util.filterAndExerciseTrackers(revealed));
        });
        if (trashSelf && tracker.hasTrack) {
            await player.trash(tracker.exercise()!);
        }
    }
}
