import Project from "../Project";
import type Player from "../../server/Player";
import type Game from "../../server/Game";
import Cost from "../../server/Cost";

export default class Canal extends Project {
    static descriptionSize = 26;
    cardArt = "/img/card-img/CanalArt.jpg";
    cardText = "During your turns, cards cost $1 less, but not less than $0.";
    intrinsicCost = {
        coin: 7
    };
    name = "canal";
    async onPlayerJoinProject(player: Player): Promise<any> {
        // Not an effect, needs to be first
        player.events.on('turnStart', async () => {
            this.getGlobalData().starting = true;
            player.game.updateCostModifiers();
            return true;
        });
        player.events.on('turnEnd', async () => {
            this.getGlobalData().starting = false;
            player.game.updateCostModifiers();
            return true;
        });
    }
    public static getCostModifier(cardData: any, game: Game, activatedCards: string[]): {[card: string]: Cost} | null {
        return activatedCards.reduce((last, a) => {
            const card = game.getCard(a);
            if (card.isCard) {
                if (cardData.starting) {
                    return {
                        ...last,
                        [a]: Cost.create(-1)
                    };
                }
                else {
                    return {
                        ...last,
                        [a]: Cost.create(0)
                    };
                }
            }
            return last;
        }, {});
    }
}