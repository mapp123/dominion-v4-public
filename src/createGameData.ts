import ReduxDataManager from "./server/ReduxDataManager";
import {struct} from "superstruct";
import Card from "./cards/Card";

export default function createGameData() {
    return ReduxDataManager({
        trash: [struct.instance(Card)],
        ways: [struct.instance(Card)]
    }, {
        trash: [],
        ways: []
    });
}

export type GameData = ReturnType<ReturnType<typeof createGameData>['getState']>;