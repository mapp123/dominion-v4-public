import type Player from "../../server/Player";
import Event from "../Event";
import {Texts} from "../../server/Texts";
import {GainRestrictions} from "../../server/GainRestrictions";
import Cost from "../../server/Cost";
import type CardHolder from "../../server/CardHolder";
import type {ValidCardTypes} from "../Card";

export default class Inheritance extends Event {
    cardArt = "/img/card-img/InheritanceArt.jpg";
    cardText = "Once per game: Set aside a non-Command Action card from the Supply costing up to $4. Move your Estate token to it. (During your turns, Estates are also Actions with \"Play the card with your Estate token, leaving it there.\")";
    tokens = ["estate"] as const;
    intrinsicCost = {
        coin: 7
    };
    name = "inheritance";
    static oncePerGame = true;
    cardHolder: Map<Player, CardHolder> = new Map();
    async onPurchase(player: Player): Promise<any> {
        const takenCard = await player.chooseGain(Texts.whereWantXToken('estate'), false, GainRestrictions.instance().setUpToCost(Cost.create(4)).setMustIncludeType('action'), 'none');
        if (takenCard) {
            const grabbed = player.game.grabCard(takenCard.id, 'supply', true);
            if (!grabbed) {
                console.error("Unable to grab after chooseGain, BAD!!!");
                return;
            }
            if (!this.cardHolder.has(player)) {
                this.cardHolder.set(player, player.game.getCardHolder(player));
            }
            player.lm('%p sets aside %l for inheritance.', [grabbed]);
            this.cardHolder.get(player)!.addCard(grabbed);
            player.data.tokens.estate = grabbed.name;

            player.events.on('turnStart', async () => {
                this.getGlobalData().starting = true;
                player.game.updateTypeModifiers();
                return true;
            });
            player.events.on('turnEnd', async () => {
                this.getGlobalData().starting = false;
                player.game.updateTypeModifiers();
                return true;
            });
        }
    }
    public static getTypeModifier(cardData: any): {[card: string]: {toRemove: ValidCardTypes[]; toAdd: ValidCardTypes[]}} | null {
        if (cardData.starting) {
            return {
                estate: {
                    toAdd: ['action'],
                    toRemove: []
                }
            };
        }
        else {
            return {
                estate: {
                    toAdd: [],
                    toRemove: []
                }
            };
        }
    }
}