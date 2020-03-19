import Player from "./Player";
import Tracker from "./Tracker";
import Card from "../cards/Card";
import Deck from "./Deck";

export type Effect = 'turnStart' | 'turnEnd' | 'buy' | 'gain' | 'trash' | 'cleanupStart' | 'buyStart' | 'handDraw' | 'treasureCardPlayed' | 'shuffle' | 'willPlayAction' | 'actionCardPlayed';
const EffectArgs: {[key in Effect]: any[]} = {
    turnStart: [],
    turnEnd: [],
    buy: ['hi'] as [string],
    gain: [] as unknown as [Tracker<Card>],
    trash: [] as unknown as [Tracker<Card>],
    cleanupStart: [],
    buyStart: [],
    handDraw: [],
    treasureCardPlayed: [] as unknown as [Card],
    shuffle: [] as unknown as [Deck],
    willPlayAction: [] as unknown as [Card],
    actionCardPlayed: [] as unknown as [Tracker<Card>]
};
type EffectFun<T extends Effect> = (unsub: () => any, ...effectArgs: typeof EffectArgs[T]) => Promise<any> | any;
type CompatFun<T extends Effect> = { [key: string]: boolean } | ((card: string, ...effectArgs: typeof EffectArgs[T]) => boolean);
type EffectDef<T extends Effect> = {
    name: string;
    compatibility: CompatFun<T>;
    effect: EffectFun<T>;
}
export default class PlayerEffects {
    private effectTable: {[key in Effect]: Array<EffectDef<key>>} = {
        turnStart: [],
        turnEnd: [],
        buy: [],
        gain: [],
        trash: [],
        cleanupStart: [],
        buyStart: [],
        handDraw: [],
        treasureCardPlayed: [],
        shuffle: [],
        willPlayAction: [],
        actionCardPlayed: []
    };
    player: Player;
    currentEffect: Effect | null = null;
    inCompat = false;
    private static __testingCards: {[key in Effect]: Set<string> | undefined} = {} as any;
    constructor(player: Player) {
        this.player = player;
    }
    async doEffect<T extends Effect>(effectName: T, prompt: string, ...effectArgs: typeof EffectArgs[T]) {
        this.currentEffect = effectName;
        const runFirst: Array<EffectDef<T>> = [];
        const ask: Array<EffectDef<T>> = [];
        const list: Array<EffectDef<T>> = [...this.effectTable[effectName]] as any;
        for (let i = 0; i < list.length; i++) {
            let fullCompat = !ask.includes(list[i]);
            for (let j = i + 1; j < list.length; j++) {
                if (list[i].name === list[j].name) continue;
                let compatible = false;
                const compatA = list[i].compatibility;
                if (typeof compatA === 'function') {
                    compatible = compatible || compatA(list[j].name, ...effectArgs);
                }
                else {
                    // noinspection PointlessBooleanExpressionJS
                    compatible = compatible || !!(compatA[list[j].name]);
                }
                const compatB = list[j].compatibility;
                if (typeof compatB === 'function') {
                    compatible = compatible || compatB(list[i].name, ...effectArgs);
                }
                else {
                    // noinspection PointlessBooleanExpressionJS
                    compatible = compatible || !!(compatB[list[j].name]);
                }
                if (!compatible) {
                    ask.push(list[j]);
                }
                fullCompat = fullCompat && compatible;
            }
            if (fullCompat) {
                runFirst.push(list[i]);
            }
            else if (!ask.includes(list[i])) {
                ask.push(list[i]);
            }
        }
        this.inCompat = true;
        for (const a of runFirst) {
            const unsub = () => this.effectTable[effectName].splice(this.effectTable[effectName].findIndex((b) => a.name === b.name), 1);
            await a.effect(unsub, ...effectArgs);
        }
        this.inCompat = false;
        while (ask.length > 0) {
            const choice = await this.player.chooseOption(prompt, ask.map((a) => a.name));
            if (!choice) {
                break;
            }
            const unsub = () => this.effectTable[effectName].splice(this.effectTable[effectName].findIndex((b) => b.name === choice), 1);
            const index = ask.findIndex((a) => a.name === choice);
            await ask[index].effect(unsub, ...effectArgs);
            ask.splice(index, 1);
        }
        this.currentEffect = null;
    }
    setupEffect<T extends Effect>(effectName: T, cardName: string, compatibility: CompatFun<T>, effect: EffectFun<T>) {
        this.effectTable[effectName].push({
            name: cardName,
            compatibility,
            effect: effect as any
        });
        if (process.env.IS_TESTING === 'true') {
            if (typeof PlayerEffects.__testingCards[effectName] === 'undefined') {
                PlayerEffects.__testingCards[effectName] = new Set();
            }
            PlayerEffects.__testingCards[effectName]!.add(cardName);
        }
        return effect;
    }
    removeEffect<T extends Effect>(effectName: T, cardName: string, effect: EffectFun<T>) {
        this.effectTable[effectName].splice(this.effectTable[effectName].findIndex((a) => a.name === cardName && a.effect === effect), 1);
    }
}