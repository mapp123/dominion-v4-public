import Card, {CardImplementation} from "../Card";
import Game from "../../server/Game";
import shuffle from "../../server/util/shuffle";

export default class Ruins extends Card {
    intrinsicTypes = ["action", "ruins"] as const;
    name = "ruins";
    cost = {
        coin: 0
    };
    cardText = "Add the ruins pile to the game if any Kingdom card has type Looter.";
    supplyCount = 0;
    cardArt = "/img/card-img/Abandoned_MineArt.jpg";
    randomizable = false;
    public static createSupplyPiles(playerCount: number, game: Game): Array<{identifier: string; pile: Card[]; identity: Card; displayCount: boolean; hideCost?: boolean}> {
        let basePile: Card[] = [];
        const implementations: CardImplementation[] = [
            game.getCard('abandoned mine'),
            game.getCard('ruined library'),
            game.getCard('ruined market'),
            game.getCard('ruined village'),
            game.getCard('survivors')
        ];
        implementations.forEach((imp) => {
            for (let i = 0; i < 10; i++) {
                basePile.push(new imp(game));
            }
        });
        shuffle(basePile);
        const supplyCount = (playerCount - 1) * 10;
        let pile: Card[] = basePile.slice(0, supplyCount);
        return [{
            pile,
            identifier: "ruins",
            // @ts-ignore
            identity: new this(game),
            displayCount: true
        }];
    }
    public static onChosen(): string[] {
        return [
            'abandoned mine',
            'ruined library',
            'ruined market',
            'ruined village',
            'survivors'
        ];
    }
    async onAction(): Promise<void> {

    }
}
