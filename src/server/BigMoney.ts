import AIPlayer from "./AIPlayer";
import Card from "../cards/Card";

export default class BigMoney extends AIPlayer {
    private static bigMoneyNumber = 1;
    discardPriority(): Promise<Array<string | null>> | Array<string | null> {
        return [
            'estate',
            'duchy',
            'province',
            null,
            'copper',
            'silver',
            'gold'
        ];
    }

    gainPriority(): Promise<Array<string | null>> | Array<string | null> {
        return [
            this.getTotalMoney() > 18 ? 'province' : undefined,
            this.gainsToEndGame() <= 4 ? 'duchy' : undefined,
            this.gainsToEndGame() <= 2 ? 'estate' : undefined,
            'gold',
            this.gainsToEndGame() <= 6 ? 'duchy' : undefined,
            'silver'
        ].filter((a) => a !== undefined) as string[];
    }

    generateUsername(): Promise<string> | string {
        return `Big Money AI ${BigMoney.bigMoneyNumber++}`;
    }

    playNextTreasure(source: Card[]): Promise<string | null> | string | null {
        return source.find((a) => a.types.includes("treasure"))!.name;
    }

    trashPriority(): Promise<Array<string | null>> | Array<string | null> {
        return [
            this.gainsToEndGame() <= 2 ? null : 'estate'
        ];
    }

    topDeckPriority(): Promise<Array<string | null>> | Array<string | null> {
        return [];
    }

    playNextAction(): Promise<string | null> | string | null {
        return null;
    }

    drawPriority(): Promise<Array<string | null>> | Array<string | null> {
        return [
            'gold',
            'silver',
            'copper'
        ];
    }
}