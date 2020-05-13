import type Player from "../../server/Player";
import Way from "../Way";
import type Tracker from "../../server/Tracker";
import type Card from "../Card";

export default class WayOfTheChameleon extends Way {
    cardArt = "/img/card-img/Way_of_the_ChameleonArt.jpg";
    cardText = "Follow this card's instructions; each time that would give you +Cards this turn, you get +$ instead, and vice-versa.";
    name = "way of the chameleon";
    async onWay(player: Player, exemptPlayers: Player[], tracker: Tracker<Card>): Promise<void> {
        const hookedOnTurn = player.turnNumber;
        const hookedPlayer = new Proxy(player, {
            get(target: Player, p: PropertyKey): any {
                if (p === "addMoney" && hookedOnTurn === target.turnNumber) {
                    return async (amount) => {
                        target.lm('%p would get +$%s, but gets +%s Card%s instead.', amount, amount, amount === 1 ? "" : "s");
                        await target.draw(amount, false);
                    };
                }
                if (p === "draw" && hookedOnTurn === target.turnNumber) {
                    return async (amount, plusCards) => {
                        if (plusCards) {
                            target.lm('%p would get +%s Card%s, but gets +$%s instead.', amount, amount === 1 ? "" : "s", amount);
                            await target.addMoney(amount);
                        }
                        else {
                            await target.draw(amount, plusCards);
                        }
                    };
                }
                if (typeof target[p] === 'function') {
                    return target[p].bind(target);
                }
                return target[p];
            }
        });
        await tracker.viewCard().onPlay(hookedPlayer, exemptPlayers, tracker);
    }
}