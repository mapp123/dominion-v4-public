import Card from "../Card";
import type Player from "../../server/Player";
import type Game from "../../server/Game";
import Cost from "../../server/Cost";

export default class BridgeTroll extends Card {
    static typelineSize = 43;
    static descriptionSize = 57;
    intrinsicTypes = ["action","attack","duration"] as const;
    name = "bridge troll";
    tokens = ["minusOneCoin"] as const;
    intrinsicCost = {
        coin: 5
    };
    cardText = "Each other player takes their –$1 token. Now and at the start of your next turn: +1 Buy\n" +
        "---\n" +
        "While this is in play, cards cost $1 less on your turns, but not less than $0.";
    supplyCount = 10;
    cardArt = "/img/card-img/BridgeTrollArt.jpg";
    private isSecondTurn = false;
    async onPlay(player: Player, exemptPlayers: Player[]): Promise<void> {
        this.isSecondTurn = false;
        await player.attackOthers(exemptPlayers, async (p) => {
            p.data.tokens.minusOneCoin = true;
        });
        player.data.buys++;
        player.effects.setupEffect('turnStart', 'bridge troll', {
            compatibility: () => true
        }, async (remove) => {
            player.data.buys++;
            this.isSecondTurn = true;
            remove();
        });
        const data = this.getGlobalData();
        if (typeof data.number === 'undefined') {
            data.number = 0;
        }
        data.number = player.data.playArea.filter((a) => a.name === 'bridge troll').length;
        player.game.updateCostModifiers();
    }
    shouldDiscardFromPlay(): boolean {
        return this.isSecondTurn;
    }

    public static getCostModifier(cardData: any, game: Game, activatedCards: string[]): {[card: string]: Cost} | null {
        return activatedCards.reduce((last, card) => {
            if (!game.getCard(card).isCard) {
                return last;
            }
            return {
                ...last,
                [card]: Cost.create(-cardData.number)
            };
        }, {});
    }

    public static setup(globalCardData: any, game: Game) {
        globalCardData.number = 0;
        game.events.on('turnStart', (player) => {
            globalCardData.number = player.data.playArea.filter((a) => a.name === 'bridge troll').length;
            game.updateCostModifiers();
            return true;
        });
    }
}
