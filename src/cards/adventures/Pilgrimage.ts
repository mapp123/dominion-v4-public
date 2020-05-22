import type Player from "../../server/Player";
import Event from "../Event";
import {Texts} from "../../server/Texts";
import Util from "../../Util";

export default class Pilgrimage extends Event {
    static descriptionSize = 29;
    cardArt = "/img/card-img/PilgrimageArt.jpg";
    cardText = "Once per turn: Turn your Journey token over (it starts face up); then if it's face up, choose up to 3 differently named cards you have in play and gain a copy of each.";
    tokens = ["journeyToken"] as const;
    intrinsicCost = {
        coin: 4
    };
    name = "pilgrimage";
    static oncePerTurn = true
    async onPurchase(player: Player): Promise<any> {
        player.data.tokens.journeyToken = player.data.tokens.journeyToken === 'UP' ? 'DOWN' : 'UP';
        if (player.data.tokens.journeyToken === 'UP') {
            const cardsToGain: string[] = [];
            for (let i = 0; i < 3; i++) {
                const card = await player.chooseCard(Texts.chooseCardToGainFor(this.name), Util.deduplicateByName(player.data.playArea).filter((a) => !cardsToGain.includes(a.name)), true);
                if (card) {
                    cardsToGain.push(card.name);
                }
                else break;
            }
            for (const cardName of cardsToGain) {
                await player.gain(cardName);
            }
        }
    }
}