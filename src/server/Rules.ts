import CardRegistry from "../cards/CardRegistry";

export default class Rules {
    static chooseBasicCards(chosenCards: string[]): string[] {
        const prosperityCards = Object.keys(CardRegistry.getInstance().cardsBySet().prosperity);
        const inProsperity = chosenCards.filter((a) => {
            return prosperityCards.includes(a);
        });
        if (Math.random() * 10 < inProsperity.length || process.env.FORCE_COLONY === 'true') {
            return ['copper', 'silver', 'gold', 'platinum', 'estate', 'duchy', 'province', 'colony', 'curse', ...chosenCards];
        }
        return ['copper', 'silver', 'gold', 'estate', 'duchy', 'province', 'curse', ...chosenCards];
    }
}