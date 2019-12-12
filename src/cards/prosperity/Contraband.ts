import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import {GainRestrictions} from "../../server/GainRestrictions";
import Game from "../../server/Game";

export default class Contraband extends Card {
    intrinsicTypes = ["treasure"] as const;
    name = "contraband";
    cost = {
        coin: 5
    };
    cardText = "+$3\n" +
        "+1 Buy\n" +
        "When you play this, the player to your left names a card. You can’t buy that card this turn.";
    supplyCount = 10;
    cardArt = "/img/card-img/ContrabandArt.jpg";
    intrinsicValue = 3;
    async onTreasure(player: Player): Promise<void> {
        player.data.money += 3;
        player.data.buys += 1;
        let playerToLeft = player.game.players.indexOf(player) - 1;
        if (playerToLeft < 0) {
            playerToLeft = player.game.players.length - 1;
        }
        const p = player.game.players[playerToLeft];
        const card = await p.chooseGain(Texts.chooseACardThatACannotBuyThisTurn(player.username), false, GainRestrictions.instance().setIsCard(false), 'none');
        if (card) {
            player.lm('%p may not buy %s this turn.', card.name);
            if (!this.getGlobalData()[player.username]) {
                this.getGlobalData()[player.username] = [];
            }
            this.getGlobalData()[player.username].push(card.name);
        }
    }
    static getExtraRestrictions(cardData: any, player: Player, restrictions: GainRestrictions): GainRestrictions {
        if (cardData[player.username]) {
            cardData[player.username].forEach((card) => {
                restrictions.addBannedCard(card);
            });
        }
        return restrictions;
    }
    static setup(globalCardData, game: Game) {
        game.events.on('turnEnd', (player) => {
            globalCardData[player.username] = [];
            return true;
        });
    }
    static getSupplyMarkers(cardData: any): {[card: string]: string[]} | null {
        return ((Object.entries(cardData).filter(([, value]) => (value as any).length)[0] || [null, []])[1] as string[]).reduce((obj, card) => {
            return {
                ...obj,
                [card]: ['Banned (Contraband)']
            };
        }, {});
    }
}
