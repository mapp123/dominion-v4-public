import ReduxDataManager from "./server/ReduxDataManager";
import {struct} from "superstruct";
import Card from "./cards/Card";

export default function createPlayerData() {
    return ReduxDataManager({
        actions: 'number',
        buys: 'number',
        money: 'number',
        vp: 'number',
        coffers: 'number',
        villagers: 'number',
        playArea: [struct.instance(Card)],
        hand: [struct.instance(Card)],
        isMyTurn: 'boolean',
        gameStarted: 'boolean',
        dataViews: struct.list(['string']),
        tokenViews: struct.list(['string']),
        tavernMat: [struct({
            card: struct.instance(Card),
            canCall: 'boolean'
        } as const)],
        exile: [struct.instance(Card)],
        tokens: {
            extraCard: struct.union(['string', 'null'] as const),
            extraAction: struct.union(['string', 'null'] as const),
            extraBuy: struct.union(['string', 'null'] as const),
            extraMoney: struct.union(['string', 'null'] as const),
            trashing: struct.union(['string', 'null'] as const),
            minusOneCoin: 'boolean',
            minusOneCard: 'boolean',
            minusTwoCost: struct.union(['string', 'null'] as const),
            journeyToken: struct.enum(['UP', 'DOWN'] as const),
            estate: struct.union(['string', 'null'] as const)
        }
    }, {
        actions: 0,
        buys: 0,
        money: 0,
        vp: 0,
        coffers: 0,
        villagers: 0,
        playArea: [],
        hand: [],
        isMyTurn: false,
        gameStarted: false,
        dataViews: [],
        tokenViews: [],
        tavernMat: [],
        exile: [],
        tokens: {
            extraCard: null,
            extraAction: null,
            extraBuy: null,
            extraMoney: null,
            trashing: null,
            minusTwoCost: null,
            minusOneCoin: false,
            minusOneCard: false,
            journeyToken: 'UP',
            estate: null
        }
    });
}

export type PlayerData = ReturnType<ReturnType<typeof createPlayerData>['getState']>;