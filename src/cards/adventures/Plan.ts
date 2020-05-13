import type Player from "../../server/Player";
import Event from "../Event";
import {Texts} from "../../server/Texts";
import {GainRestrictions} from "../../server/GainRestrictions";

export default class Plan extends Event {
    cardArt = "/img/card-img/PlanArt.jpg";
    cardText = "Move your Trashing token to an Action Supply pile. (When you buy a card from that pile, you may trash a card from your hand.)";
    tokens = ["trashing"] as const;
    intrinsicCost = {
        coin: 3
    };
    name = "plan";
    private cb: Map<string, any | null> = new Map<string, any>();
    async onPurchase(player: Player): Promise<any> {
        const card = await player.chooseGain(Texts.whereWantXToken('trashing'), false, GainRestrictions.instance().setIsAvailable(false).setMustIncludeType('action'), 'none');
        if (card) {
            player.data.tokens.trashing = card.getPileIdentifier();
            if (this.cb.has(player.id)) {
                player.effects.removeEffect('buy', this.name, this.cb.get(player.id));
            }
            const cb = player.effects.setupEffect('buy', this.name, {
                compatibility: {
                    mint: true
                },
                relevant: (cardName) => player.game.getCard(cardName).getPileIdentifier() === player.data.tokens.trashing
            }, async () => {
                const card = await player.chooseCardFromHand(Texts.chooseCardToTrashFor(this.name), true);
                if (card) {
                    await player.trash(card);
                }
            });
            this.cb.set(player.id, cb);
        }
    }
}