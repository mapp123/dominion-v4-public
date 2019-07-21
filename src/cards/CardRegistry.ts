import 'source-map-support/register';
import {readdirSync} from "fs";
import {relative, resolve, sep} from "path";
import {CardDef} from "./CardDef";

export default class CardRegistry {
    private static instance: CardRegistry;
    private constructor() {
        CardRegistry.instance = this;
    }
    public static getInstance() {
        if (!this.instance) {
            new CardRegistry();
        }
        return this.instance;
    }
    private cardCache: {[key: string]: {[key: string]: typeof CardDef}} | null = null;
    private cardLocations: {[cardName: string]: string} = {};
    public cardsBySet(): {[key: string]: {[key: string]: typeof CardDef}} {
        if (this.cardCache) {
            return this.cardCache;
        }
        const sets = readdirSync(__dirname, {
            withFileTypes: true
        });
        const cardMatcher = /.*?\.js$/;
        const cardsInSet = sets.map((a) => {
            if (!a.isDirectory()) {
                return null;
            }
            return [a.name, ...readdirSync(resolve(__dirname, a.name)).filter((a) => cardMatcher.test(a))];
        }).filter((a) => a != null) as Array<string[]>;
        this.cardCache = cardsInSet.reduce((sets, [setName, ...cards]) => {
            const set: { [key: string]: typeof CardDef } = {};
            cards.forEach((card) => {
                const path = resolve(__dirname, setName, card);
                // webpack always uses "/", so use it here even if we're on Windows. Also use .ts instead of .js
                const relPath = relative(__dirname, path).split(sep).join("/").replace(/\.js/g, '.ts');
                const cardDef: typeof CardDef = require(path).default;
                this.cardLocations[cardDef.cardName] = relPath;
                set[cardDef.cardName] = cardDef;
            });
            return {
                ...sets,
                [setName]: set
            }
        }, {});
        return this.cardCache;
    }
    private allCardsCache: {[key: string]: typeof CardDef} | null = null;
    public allCards(): {[key: string]: typeof CardDef} {
        if (!this.allCardsCache) {
            this.allCardsCache = Object.values(this.cardsBySet()).reduce((cards, set) => ({...cards, ...set}), {});
        }
        return this.allCardsCache;
    }
    public allCardLocations() {
        if (!this.cardCache) {
            this.cardsBySet();
        }
        return this.cardLocations;
    }
    public getRandomizable(): {[set: string]: string[]} {
        const sets = this.cardsBySet();
        return Object.entries(sets).reduce((sets, [setName, set]) => {
            return {
                ...sets,
                [setName]: Object.keys(set).filter((a) => set[a].randomizable)
            }
        }, {});
    }
    public getCard(card: string): typeof CardDef {
        return this.allCards()[card];
    }
    public injectCard(card: typeof CardDef) {
        this.cardLocations[card.cardName] = "";
        if (!this.cardCache) {
            this.cardsBySet();
        }
        this.cardCache!.injected = this.cardCache!.injected || {};
        this.cardCache!.injected[card.cardName] = card;
        if (!this.allCardsCache) {
            this.allCards();
        }
        this.allCardsCache![card.cardName] = card;
    }
}