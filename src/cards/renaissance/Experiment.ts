import Card from "../Card";
import Player from "../../server/Player";

export default class Experiment extends Card {
    types = ["action"] as const;
    name = "experiment";
    cost = {
        coin: 3
    };
    cardText = "+2 Cards\n" +
        "+1 Action\n" +
        "Return this to the Supply.\n" +
        "When you gain this, gain another Experiment (that doesn't come with another).";
    supplyCount = 10;
    cardArt = "/img/card-img/ExperimentArt.jpg";
    async onAction(player: Player): Promise<void> {
        player.draw(2);
        player.data.actions++;
        const card = player.data.playArea.find((a) => a.id === this.id);
        if (card) {
            player.data.playArea.splice(player.data.playArea.indexOf(card), 1);
            this.game.supply.data.piles.find((a) => a.identifier === 'experiment')!.pile.push(card);
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
