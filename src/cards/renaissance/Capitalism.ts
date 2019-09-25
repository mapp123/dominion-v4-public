import Project from "../Project";
import Player from "../../server/Player";
import Game from "../../server/Game";
import {ValidCardTypes} from "../Card";

export default class Capitalism extends Project {
    cardArt = "/img/card-img/CapitalismArt.jpg";
    cardText = "During your turns, Actions with +$ amounts in their text are also Treasures.";
    cost = {
        coin: 5
    };
    name = "capitalism";
    async onPlayerJoinProject(player: Player): Promise<any> {
        player.events.on('turnStart', async () => {
            this.getGlobalData().starting = true;
            player.game.updateTypeModifiers();
            this.getGlobalData().starting = false;
            return true;
        });
        player.events.on('turnEnd', async () => {
            player.game.updateTypeModifiers();
            return true;
        });
        player.events.on('noTreasureImpl', async (card, exemptPlayers) => {
            if ((card.constructor as any).isCard && card.types.includes("action") && card.cardText.includes("+$")) {
                await card.onAction(player, exemptPlayers);
            }
            return true;
        });
    }
    public static getTypeModifier(cardData: any, game: Game, activatedCards: string[]): {[card: string]: {toRemove: ValidCardTypes[]; toAdd: ValidCardTypes[]}} | null {
        return activatedCards.reduce((last, a) => {
            const card = game.getCard(a);
            if (card.isCard && card.types.includes("action") && card.cardText.includes("+$")) {
                if (cardData.starting) {
                    return {
                        ...last,
                        [a]: {
                            toAdd: ['treasure'],
                            toRemove: []
                        }
                    };
                }
                else {
                    return {
                        ...last,
                        [a]: {
                            toAdd: [],
                            toRemove: []
                        }
                    };
                }
            }
            return last;
        }, {});
    }
}