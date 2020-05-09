import Card from "../Card";
import type Player from "../../server/Player";

export default class Experiment extends Card {
    static descriptionSize = 57;
    intrinsicTypes = ["action"] as const;
    name = "experiment";
    intrinsicCost = {
        coin: 3
    };
    cardText = "+2 Cards\n" +
        "+1 Action\n" +
        "Return this to the Supply.\n" +
        "---\n" +
        "When you gain this, gain another Experiment (that doesn't come with another).";
    supplyCount = 10;
    cardArt = "/img/card-img/ExperimentArt.jpg";
    async onPlay(player: Player, exemptPlayers, tracker): Promise<void> {
        await player.draw(2, true);
        player.data.actions++;
        if (tracker.hasTrack) {
            this.game.supply.getPile('experiment')!.push(tracker.exercise()!);
        }
    }
    private static gainingSelf = false;
    async onGainSelf(player: Player): Promise<void> {
        if (!Experiment.gainingSelf) {
            Experiment.gainingSelf = true;
            if (await player.gain('experiment', undefined, false)) {
                player.lm('%p gains an extra experiment.');
            }
            Experiment.gainingSelf = false;
        }
    }
}
