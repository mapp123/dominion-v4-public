import {CardDef} from "../cards/CardDef";
// eslint-disable-next-line @typescript-eslint/camelcase
import {unstable_createResource} from "@luontola/react-cache";
// @ts-ignore
const context: (module: string) => Promise<{default: typeof CardDef}> = require.context(
    '../cards', true, /\.\/(.*?)\/(.*?)\.ts/, 'lazy'
);
export default class ClientCardRegistry {
    private static instance: ClientCardRegistry | null = null;
    private locations: {[key: string]: string} = {};
    private cardDefs: {[key: string]: typeof CardDef | undefined} = {};
    private awaitingLocations: {[key: string]: Array<() => any> | undefined} = {};
    private constructor() {
        this.getCard = this.getCard.bind(this);
    }
    public async getCard(cardName: string, location?: string): Promise<typeof CardDef> {
        let card = this.cardDefs[cardName];
        if (!card) {
            if (!this.locations[cardName] && !location) {
                let a = this.awaitingLocations[cardName];
                if (!a) {
                    a = [];
                    this.awaitingLocations[cardName] = a;
                }
                await new Promise((f) => {a!.push(f);});
                console.log("done waiting");
            }
            else if (!this.locations[cardName]) {
                this.locations[cardName] = location!;
            }
            card = (await context("./" + (this.locations[cardName] || location || ''))).default;
            this.cardDefs[cardName] = card;
            let a = this.awaitingLocations[cardName];
            if (a) {
                a.forEach((f) => f());
            }
        }
        return card;
    }
    public static getInstance() {
        if (!this.instance) {
            this.instance = new this();
        }
        return this.instance;
    }
}
export const CardResource = unstable_createResource(ClientCardRegistry.getInstance().getCard);