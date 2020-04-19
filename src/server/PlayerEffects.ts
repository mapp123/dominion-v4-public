import Player from "./Player";
import Tracker from "./Tracker";
import Card from "../cards/Card";
import Deck from "./Deck";
import {v4} from 'uuid';

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
type Context<K> = {
    duplicateKey?: K;
}
type Unsub<K> = (() => any) & {ctx: Context<K>; skipDuplicates: () => any};
type EffectFun<T extends Effect, K> = (unsub: Unsub<K>, ...effectArgs: typeof EffectArgs[T]) => Promise<any> | any;
type RelevantFun<T extends Effect> = (...effectArgs: typeof EffectArgs[T]) => boolean;
type CompatFun<T extends Effect> = { [key: string]: boolean } | ((card: string, ...effectArgs: typeof EffectArgs[T]) => boolean);
type DuplicateFun<T extends Effect, K> = (...effectArgs: typeof EffectArgs[T]) => K[];
type EffectDef<T extends Effect, K> = {
    id: string;
    name: string;
    config: {
        compatibility: CompatFun<T>;
        optional?: boolean;
        relevant?: RelevantFun<T>;
        temporalRelevance?: RelevantFun<T>;
        duplicate?: DuplicateFun<T, K>;
    };
    effect: EffectFun<T, K>;
}
export default class PlayerEffects {
    private effectTable: {[key in Effect]: Array<EffectDef<key, any>>} = {
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
        let runFirst: Array<EffectDef<T, any> & {duplicateKey: any | undefined}> = [];
        let ask: Array<EffectDef<T, any> & {duplicateKey: any | undefined}> = [];
        const baseList: Array<EffectDef<T, any>> = [...this.effectTable[effectName]] as any;
        const list: Array<EffectDef<T, any> & {duplicateKey: any | undefined}> = baseList.filter((a) => typeof a.config.relevant === 'undefined' || a.config.relevant(...effectArgs)).flatMap((a) => {
            if (typeof a.config.duplicate === 'undefined') {
                return a;
            }
            const keys = a.config.duplicate(...effectArgs);
            return keys.map((key) => ({
                ...a,
                duplicateKey: key
            }));
        }) as any;
        const genUnsub: (id: string) => Unsub<any> = ((id: string) => {
            const remove = () => {
                // @ts-ignore
                this.effectTable[effectName] = this.effectTable[effectName].filter((a) => a.id !== id);
            };
            remove.skipDuplicates = () => {
                ask = ask.filter((a) => a.id !== id);
                runFirst = runFirst.filter((a) => a.id !== id);
            };
            return remove;
        }) as any;
        for (let i = 0; i < list.length; i++) {
            let fullCompat = !ask.includes(list[i]);
            for (let j = i + 1; j < list.length; j++) {
                if (list[i].name === list[j].name) continue;
                let compatible = false;
                const compatA = list[i].config.compatibility;
                if (typeof compatA === 'function') {
                    compatible = compatible || compatA(list[j].name, ...effectArgs);
                }
                else {
                    // noinspection PointlessBooleanExpressionJS
                    compatible = compatible || !!(compatA[list[j].name]);
                }
                const compatB = list[j].config.compatibility;
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
        while (runFirst.length > 0) {
            const a = runFirst[0];
            const unsub = genUnsub(a.id);
            unsub.ctx = {
                duplicateKey: a.duplicateKey
            };
            await a.effect(unsub, ...effectArgs);
            if (runFirst.length > 0 && runFirst[0].id === a.id) {
                runFirst.splice(0, 1);
            }
        }
        this.inCompat = false;
        while (ask.length > 0) {
            const choice = await this.player.chooseOption(prompt, ask.filter((a) => typeof a.config.temporalRelevance !== 'function' || a.config.temporalRelevance()).map((a) => a.id));
            if (!choice) {
                break;
            }
            const unsub = (() => this.effectTable[effectName].splice(this.effectTable[effectName].findIndex((b) => b.name === choice), 1)) as Unsub<any>;
            const index = ask.findIndex((a) => a.id === choice);
            unsub.ctx = {
                duplicateKey: ask[index].duplicateKey
            };
            await ask[index].effect(unsub, ...effectArgs);
            const removeIndex = ask.findIndex(a => a.id === choice);
            if (removeIndex !== -1) ask.splice(index, 1);
        }
        this.currentEffect = null;
    }
    setupEffect<T extends Effect, K>(effectName: T, cardName: string, config: EffectDef<T, K>["config"], effect: EffectFun<T, K>) {
        const item: EffectDef<T, K> = {
            id: v4(),
            name: cardName,
            config,
            effect: effect
        };
        this.effectTable[effectName].push(item as any);
        if (process.env.IS_TESTING === 'true') {
            if (typeof PlayerEffects.__testingCards[effectName] === 'undefined') {
                PlayerEffects.__testingCards[effectName] = new Set();
            }
            PlayerEffects.__testingCards[effectName]!.add(cardName);
        }
        return effect;
    }
    removeEffect<T extends Effect>(effectName: T, cardName: string, effect: EffectFun<T, any>) {
        this.effectTable[effectName].splice(this.effectTable[effectName].findIndex((a) => a.name === cardName && a.effect === effect), 1);
    }
}