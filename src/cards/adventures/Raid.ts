import type Player from "../../server/Player";
import Event from "../Event";

export default class Raid extends Event {
    cardArt = "/img/card-img/RaidArt.jpg";
    cardText = "Gain a Silver per Silver you have in play. Each other player puts their –1 Card token on their deck.";
    intrinsicCost = {
        coin: 5
    };
    name = "raid";
    async onPurchase(player: Player): Promise<any> {
        const toGain = player.data.playArea.filter((a) => a.name === 'silver').length;
        for (let i = 0; i < toGain; i++) {
            await player.gain('silver');
        }
        await player.affectOthers(async (p) => {
            p.data.tokens.minusOneCard = true;
        });
    }
}