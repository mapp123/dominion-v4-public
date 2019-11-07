import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Game from "../../server/Game";

export default class TradeRoute extends Card {
    static descriptionSize = 45;
    intrinsicTypes = ["action"] as const;
    name = "trade route";
    cost = {
        coin: 3
    };
    cardText = "+1 Buy\n" +
        "Trash a card from your hand.\n" +
        "$1 per Coin token on the Trade Route mat.\n" +
        "---\n" +
        "Setup: Add a Coin token to each Victory Supply pile; move that token to the Trade Route mat when a card is gained from the pile.";
    supplyCount = 10;
    cardArt = "/img/card-img/Trade_RouteArt.jpg";
    static smallText = true;
    async onAction(player: Player): Promise<void> {
        player.data.buys++;
        const card = await player.chooseCardFromHand(Texts.chooseCardToTrashFor('trade route'));
        if (card) {
            await player.trash(card);
        }
        player.data.money += this.getGlobalData().coins || 0;
    }
    static setup(globalCardData, game: Game) {
        globalCardData.tokens = {};
        game.supply.data.piles.forEach((pile) => {
            if (pile.identity.types.includes("victory")) {
                globalCardData.tokens[pile.identity.name] = true;
            }
        });
        game.events.on('gain', (player, tracker) => {
            if (tracker.viewCard().types.includes("victory") && globalCardData.tokens[tracker.viewCard().name]) {
                globalCardData.tokens[tracker.viewCard().name] = false;
                globalCardData.coins = (globalCardData.coins || 0) + 1;
            }
            return true;
        });
    }
    static getSupplyMarkers(cardData: any): {[card: string]: string[]} | null {
        return Object.entries(cardData.tokens).filter(([,value]) => value).reduce((obj, [card]) => {
            return {
                ...obj,
                [card]: ['Trade Route Token']
            };
        }, {
            "trade route": [`Value: ${cardData.coins || 0}`]
        });
    }
}
