import ReduxDataManager from "./server/ReduxDataManager";
import {struct} from "superstruct";
import Card from "./cards/Card";

export default function createSupplyData() {
    return ReduxDataManager({
        piles: [{
            identifier: 'string',
            pile: [struct.instance(Card)],
            identity: struct.instance(Card),
            displayCount: 'boolean'
        }],
        locations: struct.dict(['string', 'string']),
        activatedCards: ["string"],
        globalCardData: struct.dict(['string', 'any'])
    }, {
        piles: [],
        locations: {},
        activatedCards: [],
        globalCardData: {}
    });
}
export type SupplyData = ReturnType<ReturnType<typeof createSupplyData>['getState']>;