import BigMoney from "./BigMoney";
import Util from "../../Util";
import type Game from "../Game";

export default class DoubleMilitia extends BigMoney {
    static canBeUsed(game: Game): boolean {
        return game.selectedCards.includes("militia");
    }
    gainPriority(): Promise<Array<string | null>> | Array<string | null> {
        return [
            "province",
            this.gainsToEndGame() <= 5 ? "duchy" : null,
            this.countInDeck("militia") < 2 ? "militia" : null,
            this.gainsToEndGame() <= 2 ? "estate" : null,
            "gold",
            "silver",
            this.gainsToEndGame() <= 3 ? "copper" : null
        ].filter(Util.nonNull);
    }

    playNextAction(): Promise<string | null> | string | null {
        if (this.data.hand.find((a) => a.name === "militia") != null) {
            return "militia";
        }
        return null;
    }

    generateUsername(): Promise<string> | string {
        return `Double Militia AI ${this.game.aiNumber++}`;
    }
}