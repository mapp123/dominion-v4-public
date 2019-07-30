import ReduxDataManager from "./server/ReduxDataManager";
import {struct} from "superstruct";
import Card from "./cards/Card";

export default function createPlayerData() {
    return ReduxDataManager({
        actions: 'number',
        buys: 'number',
        money: 'number',
        vp: 'number',
        playArea: [struct.instance(Card)],
        hand: [struct.instance(Card)],
        isMyTurn: 'boolean',
        gameStarted: 'boolean',
        dataViews: struct.list(['string'])
    }, {
        actions: 0,
        buys: 0,
        money: 0,
        vp: 0,
        playArea: [],
        hand: [],
        isMyTurn: false,
        gameStarted: false,
        dataViews: []
    });
}

export type PlayerData = ReturnType<ReturnType<typeof createPlayerData>['getState']>;