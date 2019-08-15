import Player from "./Player";
import {Decision, DecisionDefaults, DecisionResponseType} from "./Decision";

type PossibleAsync<T> = T | Promise<T>;

export default abstract class AIPlayer extends Player {
    private hasPlayedAllTreasures = false;
    async makeDecision<T extends Decision>(de: T): Promise<DecisionResponseType[T["decision"]]> {
        const decision: Decision = de;
        const d = DecisionDefaults[decision.decision](decision);
        if (d != null) {
            return d as any;
        }
        switch (decision.decision) {
            case "chooseCardOrBuy":
                if (!this.hasPlayedAllTreasures) {
                    const toPlay = await this.playNextTreasure();
                    if (toPlay) {
                        return decision.source.find((a) => a.name === toPlay) as any;
                    }
                    else {
                        this.hasPlayedAllTreasures = true;
                    }
                }
            case "buy":
                const toBuy = (await this.gainPriority()).find((a) => a == null || decision.gainRestrictions.allowedCards.includes(a));
                if (toBuy) {
                    const pile = this.game.supply.data.piles.find((a) => a.pile[a.pile.length - 1].name === toBuy)!.pile;
                    return pile[pile.length - 1] as any;
                }
                else {
                    return {
                        responseType: 'buy',
                        choice: {
                            name: 'No Card',
                            id: ''
                        }
                    } as any;
                }
            case "chooseOption":

                break;
            case "chooseCard":

                break;
            case "chooseUsername":
                return this.generateUsername() as any;
            case "confirm":

                break;
            case "gain":

                break;
            case "reorder":

                break;
        }
    }
    abstract gainPriority(): PossibleAsync<Array<string | null>>;
    abstract playNextTreasure(): PossibleAsync<string | null>;
    abstract generateUsername(): PossibleAsync<string>;
}