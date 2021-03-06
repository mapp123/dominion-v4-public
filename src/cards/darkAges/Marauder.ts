import Card from "../Card";
import type Player from "../../server/Player";

export default class Marauder extends Card {
    static typelineSize = 48;
    intrinsicTypes = ["action","attack","looter"] as const;
    name = "marauder";
    intrinsicCost = {
        coin: 4
    };
    cardText = "Gain a Spoils from the Spoils pile. Each other player gains a Ruins.";
    supplyCount = 10;
    cardArt = "/img/card-img/MarauderArt.jpg";
    async onPlay(player: Player, exemptPlayers: Player[]): Promise<void> {
        await player.gain('spoils');
        await player.attackOthers(exemptPlayers,async (p) => {
            await p.gain('ruins');
        });
    }
    static onChosen() {
        return [
            'ruins',
            'spoils'
        ];
    }
}
