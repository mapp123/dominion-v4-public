import ReduxDataManager from "./server/ReduxDataManager";
import {Struct, struct} from "superstruct";
import Card from "./cards/Card";
import Cost from "./server/Cost";

export default function createSupplyData() {
    return ReduxDataManager({
        piles: [{
            identifier: 'string',
            pile: struct.list<ReadonlyArray<Struct<Card>>>([struct.instance(Card)] as const),
            identity: struct.instance(Card),
            displayCount: 'boolean',
            hideCost: 'boolean?',
            inSupply: 'boolean?'
        } as const],
        locations: struct.dict(['string', 'string']),
        activatedCards: ["string"],
        globalCardData: struct.dict(['string', 'any']),
        costModifiers: struct.dict(['string', struct.instance(Cost)]),
        typeModifiers: struct.dict(['string', struct({toAdd: ['string'], toRemove: ['string']})])
    }, {
        piles: [],
        locations: {},
        activatedCards: [],
        globalCardData: {},
        costModifiers: {},
        typeModifiers: {}
    });
}
export type SupplyData = ReturnType<ReturnType<typeof createSupplyData>['getState']>;