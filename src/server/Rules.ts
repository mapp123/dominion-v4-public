import CardRegistry from "../cards/CardRegistry";
import type {CardImplementation} from "../cards/Card";
import Copper from "../cards/base/Copper";
import Estate from "../cards/base/Estate";
import Hovel from "../cards/darkAges/Hovel";
import Necropolis from "../cards/darkAges/Necropolis";
import OvergrownEstate from "../cards/darkAges/OvergrownEstate";

export default class Rules {
    static countInSet(set: string, cards: string[]): number {
        const cardsInSet = Object.keys(CardRegistry.getInstance().cardsBySet()[set]);
        const inSet = cards.filter((a) => cardsInSet.includes(a));
        return inSet.length;
    }
    static chooseBasicCards(chosenCards: string[]): string[] {
        const inProsperity = this.countInSet('prosperity', chosenCards);
        if (Math.random() * 10 < inProsperity || process.env.FORCE_COLONY === 'true') {
            return ['copper', 'silver', 'gold', 'platinum', 'estate', 'duchy', 'province', 'colony', 'curse', ...chosenCards];
        }
        return ['copper', 'silver', 'gold', 'estate', 'duchy', 'province', 'curse', ...chosenCards];
    }
    static getStartingCards(chosenCards: string[]): CardImplementation[] {
        const inDarkAges = this.countInSet('darkAges', chosenCards);
        const coppers = [
            Copper,
            Copper,
            Copper,
            Copper,
            Copper,
            Copper,
            Copper
        ] as CardImplementation[];
        let estates = [
            Estate,
            Estate,
            Estate
        ] as CardImplementation[];
        if (Math.random() < (inDarkAges / chosenCards.length)) {
            estates = [Hovel, Necropolis, OvergrownEstate];
        }
        return [...coppers, ...estates];
    }
}