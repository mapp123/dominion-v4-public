import {StructForm} from "superstruct";

export interface CardInstance {
    name: string;
    id: string;
}
export function cleanCard(card: CardInstance): CardInstance {
    return {
        name: card.name,
        id: card.id
    };
}
export const CardInstanceStruct = {
    name: 'string',
    id: 'string'
} as const;
// Check to ensure CardInstanceStruct satisfies CardInstance
const a: StructForm<typeof CardInstanceStruct> = null as any;
const b: CardInstance = a;