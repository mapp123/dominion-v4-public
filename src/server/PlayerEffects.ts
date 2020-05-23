import type Player from "./Player";
import type Tracker from "./Tracker";
import type Card from "../cards/Card";
import type Deck from "./Deck";
import {v4} from 'uuid';
import type Game from "./Game";

export type Effect = 'turnStart' | 'turnEnd' | 'buy' | 'beforeGain' | 'gain' | 'trash' | 'cleanupStart' | 'buyStart' | 'handDraw' | 'shuffle' | 'cardPlayed' | 'willPlayCard' | 'buyEnd' | 'afterTurn' | 'play' | 'discard' | 'discardFromPlay';
type EffectArgs = {
    turnStart: [];
    turnEnd: [];
    discard: [Tracker<Card>];
    discardFromPlay: [Tracker<Card>];
    buy: [string];
    gain: [Tracker<Card>];
    beforeGain: [Tracker<Card>];
    trash: [Tracker<Card>];
    cleanupStart: [];
    buyStart: [];
    handDraw: [];
    shuffle: [Deck];
    cardPlayed: [Tracker<Card>];
    willPlayCard: [Card];
    buyEnd: [];
    afterTurn: [];
    play: [Tracker<Card>, boolean];
}
type Context<K> = {
    duplicateKey?: K;
}
type Unsub<K> = (() => any) & {ctx: Context<K>; skipDuplicates: () => any; consumed: boolean; additionalCtx: any};
export type EffectFun<T extends Effect, K> = (unsub: Unsub<K>, ...effectArgs: EffectArgs[T]) => (Promise<any> | any);
type RelevantFun<T extends Effect> = (additionalCtx: unknown, ...effectArgs: EffectArgs[T]) => boolean;
type CompatFun<T extends Effect> = { [key: string]: boolean } | ((card: string, ...effectArgs: EffectArgs[T]) => boolean);
type DuplicateFun<T extends Effect, K> = (...effectArgs: EffectArgs[T]) => K[];
export type EffectDef<T extends Effect, K> = {
    id: string;
    name: string;
    config: {
        compatibility: CompatFun<T>;
        optional?: boolean;
        relevant?: RelevantFun<T>;
        startResolve?: RelevantFun<T>;
        temporalRelevance?: RelevantFun<T>;
        duplicate?: DuplicateFun<T, K>;
        requiresUnconsumed?: boolean;
        runsOnce?: boolean;
    };
    effectName: Effect;
    effect: EffectFun<T, K>;
}
export default class PlayerEffects {
    protected effectTable: {[key in Effect]: Array<EffectDef<key, any>>} = {
        turnStart: [],
        turnEnd: [],
        buy: [],
        beforeGain: [],
        gain: [],
        trash: [],
        cleanupStart: [],
        buyStart: [],
        handDraw: [],
        shuffle: [],
        cardPlayed: [],
        willPlayCard: [],
        buyEnd: [],
        afterTurn: [],
        play: [],
        discard: [],
        discardFromPlay: []
    };
    player: Player;
    currentEffects: Effect[] | null = null;
    inCompat = false;
    protected activateGameEffects = true;
    private static __testingCards: {[key in Effect]: Array<EffectDef<key, any> & {lastArgs?: EffectArgs[key]}> | undefined} = {} as any;
    constructor(player: Player) {
        this.player = player;
    }
    async doEffect<T extends Effect>(effectName: T, prompt: string, additionalConfigs: Array<EffectDef<T, any>>, ...effectArgs: EffectArgs[T]) {
        return this.doMultiEffect([effectName], prompt, additionalConfigs, ...effectArgs);
    }
    genUnsub(id: string, effectName: string, skipDuplicates: (id: string) => any, consumed: {value: boolean}, additionalCtx: {}): Unsub<any> {
        const consume = () => consumed.value = true;
        const remove = () => {
            // @ts-ignore
            this.effectTable[effectName] = this.effectTable[effectName].filter((a) => a.id !== id);
        };
        remove.skipDuplicates = skipDuplicates.bind(null, id);
        Object.defineProperty(remove, 'consumed', {
            get(): any {
                return consumed.value;
            },
            set() {
                consume();
            }
        });
        remove.ctx = {};
        remove.additionalCtx = additionalCtx;
        return remove as (typeof remove & {consumed: boolean});
    }
    protected relevant<T extends Effect>(config: EffectDef<T, any>["config"], additionalCtx: any, effectsArgs: EffectArgs[T], temporal = true): boolean {
        let rel = true;
        if (typeof config.relevant !== 'undefined') {
            rel = rel && config.relevant(additionalCtx, ...effectsArgs);
        }
        if (typeof config.temporalRelevance !== 'undefined' && temporal) {
            rel = rel && config.temporalRelevance(additionalCtx, ...effectsArgs);
        }
        return rel;
    }
    async doMultiEffect<T extends Effect>(effectNames: T[], prompt: string, additionalConfigs: Array<EffectDef<T, any>>, ...effectArgs: EffectArgs[T]) {
        this.currentEffects = effectNames;
        let runFirst: Array<EffectDef<T, any> & {duplicateKey: any | undefined}> = [];
        let ask: Array<EffectDef<T, any> & {duplicateKey: any | undefined}> = [];
        const baseList: Array<EffectDef<T, any>> = [...effectNames.flatMap((a) => this.effectTable[a]), ...additionalConfigs] as any;
        const additionalCtx = {};
        baseList.forEach((a) => (typeof a.config.startResolve !== 'undefined' && a.config.startResolve(additionalCtx, ...effectArgs)));
        const list: Array<EffectDef<T, any> & {duplicateKey: any | undefined}> = baseList.filter((a) => this.relevant(a.config, additionalCtx, effectArgs, false)).flatMap((a) => {
            if (typeof a.config.duplicate === 'undefined') {
                return a;
            }
            const keys = a.config.duplicate(...effectArgs);
            return keys.map((key) => ({
                ...a,
                duplicateKey: key
            }));
        }) as any;
        const skipDuplicates = (id: string) => {
            ask = ask.filter((a) => a.id !== id);
            runFirst = runFirst.filter((a) => a.id !== id);
        };
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
        if (process.env.IS_TESTING === 'true') {
            effectNames.forEach((effectName) => {
                if (typeof PlayerEffects.__testingCards[effectName] !== 'undefined') {
                    PlayerEffects.__testingCards[effectName]!.forEach((def) => {
                        if (list.some((a) => a.effect === def.effect)) {
                            def.lastCall = effectArgs;
                        }
                    });
                }
            });
        }
        const consumed = {value: false};
        this.inCompat = true;
        while (runFirst.length > 0) {
            const a = runFirst[0];
            if (!a.config.requiresUnconsumed || !consumed.value) {
                const unsub = this.genUnsub(a.id, a.effectName, skipDuplicates, consumed, additionalCtx);
                unsub.ctx = {
                    duplicateKey: a.duplicateKey
                };
                await a.effect(unsub, ...effectArgs);
            }
            // noinspection PointlessBooleanExpressionJS
            if (runFirst.length > 0 && runFirst[0].id === a.id && (runFirst[0].config.runsOnce !== false || !this.relevant(runFirst[0].config, additionalCtx, effectArgs))) {
                runFirst.splice(0, 1);
            }
        }
        this.inCompat = false;
        while (ask.length > 0) {
            const options = ask.filter((a) => this.relevant(a.config, additionalCtx, effectArgs) && (!a.config.requiresUnconsumed || !consumed.value));
            if (options.length === 0) {
                break;
            }
            let choice: string;
            if (options.length === 1 && !options[0].config.optional) {
                choice = options[0].name;
            }
            else {
                choice = await this.player.chooseOption(prompt, [...options.map((a) => a.name), ...(ask.every((a) => a.config.optional) ? ['No Effect'] : [])]);
            }
            if (!choice || choice === 'No Effect') {
                break;
            }
            const item = ask.find((b) => b.name === choice)!;
            const unsub = this.genUnsub(item.id, item.effectName, skipDuplicates, consumed, additionalCtx);
            const index = ask.findIndex((a) => a.name === choice);
            unsub.ctx = {
                duplicateKey: ask[index].duplicateKey
            };
            await ask[index].effect(unsub, ...effectArgs);
            const removeIndex = ask.findIndex(a => a.id === item.id);
            // noinspection PointlessBooleanExpressionJS
            if (removeIndex !== -1 && ask[removeIndex].config.runsOnce !== false) ask.splice(index, 1);
        }
        this.currentEffects = null;
        if (this.activateGameEffects) {
            await this.player.game.effects.doGameMultiEffect(effectNames, prompt, this.player, ...effectArgs);
        }
    }
    setupEffect<T extends Effect, K = undefined>(effectName: T, cardName: string, config: EffectDef<T, K>["config"], effect: EffectFun<T, K>) {
        const item: EffectDef<T, K> = {
            id: v4(),
            name: cardName,
            config,
            effect: effect,
            effectName
        };
        this.effectTable[effectName].push(item as any);
        if (process.env.IS_TESTING === 'true') {
            if (typeof PlayerEffects.__testingCards[effectName] === 'undefined') {
                PlayerEffects.__testingCards[effectName] = [];
            }
            PlayerEffects.__testingCards[effectName]!.push(item as any);
        }
        return effect;
    }
    setupMultiEffect<T extends Effect, K = undefined>(effectName: T, cardName: string, config: EffectDef<T, K>["config"] & {getItems: (...args: EffectArgs[T]) => string[]}, effect: EffectFun<T, K>) {
        const {getItems, ...rest} = config;
        const intId = v4();
        const newConfig: EffectDef<T, K>["config"] = {
            ...rest,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            startResolve: (ctx, ..._args) => {
                (ctx as any)[cardName + intId] = [];
                return true;
            },
            temporalRelevance: (ctx, ...args) => (typeof rest.temporalRelevance === 'undefined' ? true : rest.temporalRelevance(ctx, ...args)) && getItems(...args).some((a) => !(ctx as any)[cardName + intId].includes(a)),
            runsOnce: false
        };
        const newEffect: EffectFun<T, K> = async (remove, ...args) => {
            const items = getItems(...args);
            if (items.some((a) => !remove.additionalCtx[cardName + intId].includes(a))) {
                remove.additionalCtx[cardName] = () => {
                    const items = getItems(...args);
                    if (items.some((a) => !remove.additionalCtx[cardName + intId].includes(a))) {
                        remove.additionalCtx[cardName + intId].push(items.find((a) => !remove.additionalCtx[cardName + intId].includes(a)));
                        return remove.additionalCtx[cardName + intId][remove.additionalCtx[cardName + intId].length - 1];
                    }
                    return undefined;
                };
                await effect(remove, ...args);
            }
        };
        return this.setupEffect(effectName, cardName, newConfig, newEffect);
    }
    removeEffect<T extends Effect>(effectName: T, cardName: string, effect: EffectFun<T, any>) {
        this.effectTable[effectName].splice(this.effectTable[effectName].findIndex((a) => a.name === cardName && a.effect === effect), 1);
    }
}
export interface GameUnsub<K> extends Unsub<K> {
    activatingPlayer?: Player;
}
export type GameEffectFun<T extends Effect, K> = (unsub: GameUnsub<K>, ...effectArgs: EffectArgs[T]) => (Promise<any> | any);
type GameRelevantFun<T extends Effect> = (player: Player, ctx: unknown, ...effectArgs: EffectArgs[T]) => boolean;
export interface GameEffectDef<T extends Effect, K> extends EffectDef<T, K> {
    config: Omit<EffectDef<T, K>["config"], 'relevant'> & {player: Player; relevant: GameRelevantFun<T>};
    effect: GameEffectFun<T, K>;
}
// @ts-ignore
export class GameEffects extends PlayerEffects {
    game: Game;
    currentPlayerIndex = 0;
    private activatingPlayer: Player = null as any;
    private initialTable!: {[key: string]: any[]};
    get player() {
        return this.game.players[this.currentPlayerIndex];
    }
    set player(_player: Player) {}
    get effectTable() {
        return this.perPlayerEffectTable[this.game.players[this.currentPlayerIndex].id];
    }
    set effectTable(a: any) {
        if (this.game != null) {
            this.perPlayerEffectTable[this.game.players[this.currentPlayerIndex].id] = a;
        }
        else {
            this.initialTable = a;
        }
    }
    private perPlayerEffectTable: {[playerId: string]: {[key in Effect]: Array<EffectDef<key, any>>}} = {};
    protected activateGameEffects = false;
    constructor(game: Game) {
        super(null as any);
        this.game = game;
    }
    setup() {
        this.game.players.forEach((player) => {
            this.perPlayerEffectTable[player.id] = Object.fromEntries(Object.entries(this.initialTable).map(([key]) => [key, []])) as any;
        });
    }
    genUnsub(id: string, effectName: string, skipDuplicates: (id: string) => any, consumed: { value: boolean }, additionalCtx: {}): Unsub<any> {
        const u = super.genUnsub(id, effectName, skipDuplicates, consumed, additionalCtx);
        (u as GameUnsub<any>).activatingPlayer = this.activatingPlayer;
        return u;
    }
    async doGameEffect<T extends Effect>(effectName: T, prompt: string, activatedByPlayer: Player, ...effectArgs: EffectArgs[T]) {
        return this.doGameMultiEffect([effectName], prompt, activatedByPlayer, ...effectArgs);
    }
    async doGameMultiEffect<T extends Effect>(effectNames: T[], prompt: string, activatedByPlayer: Player, ...effectArgs: EffectArgs[T]) {
        const lastPlayerIndex = this.currentPlayerIndex;
        this.currentPlayerIndex = (this.game.players.findIndex((a) => a.id === activatedByPlayer.id) + 1) % this.game.players.length;
        const lastActivatingPlayer = this.activatingPlayer;
        this.activatingPlayer = activatedByPlayer;
        for (let playersHandled = 0; playersHandled < this.game.players.length; playersHandled++) {
            await super.doMultiEffect(effectNames, prompt, [], ...effectArgs);
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.game.players.length;
        }
        this.activatingPlayer = lastActivatingPlayer;
        this.currentPlayerIndex = lastPlayerIndex;
    }
    protected setupEffect<T extends Effect, K = undefined>(effectName: T, cardName: string, config: EffectDef<T, K>["config"], effect: EffectFun<T, K>) {
        return super.setupEffect(effectName, cardName, config, effect);
    }
    setupGameEffect<T extends Effect, K = undefined>(effectName: T, cardName: string, config: GameEffectDef<T, K>["config"], effect: GameEffectFun<T, K>) {
        const item: EffectDef<T, K> = {
            id: v4(),
            name: cardName,
            config: {
                ...config,
                relevant: (ctx, ...args) => config.relevant(this.activatingPlayer, ctx, ...args)
            },
            effect: effect,
            effectName
        };
        this.perPlayerEffectTable[config.player.id][effectName].push(item as any);
        return effect;
    }
    protected setupMultiEffect<T extends Effect, K = undefined>(effectName: T, cardName: string, config: EffectDef<T, K>["config"] & {getItems: (...args: EffectArgs[T]) => string[]}, effect: EffectFun<T, K>) {
        return super.setupMultiEffect(effectName, cardName, config, effect);
    }
    setupMultiGameEffect<T extends Effect, K = undefined>(effectName: T, cardName: string, config: GameEffectDef<T, K>["config"] & {getItems: (...args: EffectArgs[T]) => string[]}, effect: GameEffectFun<T, K>) {
        const {getItems, ...rest} = config;
        const intId = v4();
        const newConfig: GameEffectDef<T, K>["config"] = {
            ...rest,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            startResolve: (ctx, ..._args) => {
                (ctx as any)[cardName + intId] = [];
                return true;
            },
            temporalRelevance: (ctx, ...args) => (typeof rest.temporalRelevance === 'undefined' ? true : rest.temporalRelevance(ctx, ...args)) && getItems(...args).some((a) => !(ctx as any)[cardName + intId].includes(a)),
            runsOnce: false
        };
        const newEffect: GameEffectFun<T, K> = async (remove, ...args) => {
            const items = getItems(...args);
            if (items.some((a) => !remove.additionalCtx[cardName + intId].includes(a))) {
                remove.additionalCtx[cardName] = () => {
                    const items = getItems(...args);
                    if (items.some((a) => !remove.additionalCtx[cardName + intId].includes(a))) {
                        remove.additionalCtx[cardName + intId].push(items.find((a) => !remove.additionalCtx[cardName + intId].includes(a)));
                        return remove.additionalCtx[cardName + intId][remove.additionalCtx[cardName + intId].length - 1];
                    }
                    return undefined;
                };
                await effect(remove, ...args);
            }
        };
        return this.setupGameEffect(effectName, cardName, newConfig, newEffect);
    }

    protected removeEffect<T extends Effect>(effectName: T, cardName: string, effect: EffectFun<T, any>) {
        return super.removeEffect(effectName, cardName, effect);
    }
    removeGameEffect<T extends Effect>(effectName: T, cardName: string, player: Player, effect: EffectFun<T, any>) {
        this.perPlayerEffectTable[player.id][effectName].splice(this.perPlayerEffectTable[player.id][effectName].findIndex((a) => a.name === cardName && a.effect === effect), 1);
    }
}