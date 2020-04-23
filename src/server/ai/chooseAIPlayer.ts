import type Game from "../Game";
import type {AIPlayerImplementation} from "./AIPlayer";
import BigMoney from "./BigMoney";
import DoubleMilitia from "./DoubleMilitia";

export function chooseAIPlayer(game: Game): AIPlayerImplementation {
    const implementations = [
        DoubleMilitia
    ] as AIPlayerImplementation[];
    return implementations.find((impl) => impl.canBeUsed(game)) || BigMoney;
}