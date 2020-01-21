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
        tavernMat: [struct({
            card: struct.instance(Card),
            canCall: 'boolean'
        })]
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
        tavernMat: []
    });
}

export type PlayerData = ReturnType<ReturnType<typeof createPlayerData>['getState']>;