import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import type Game from "../../server/Game";

export default class Sleigh extends Card {
    intrinsicTypes = ["action","reaction"] as const;
    name = "sleigh";
    intrinsicCost = {
        coin: 2
    };
    cardText = "Gain 2 Horses.\n" +
        "---\n" +
        "When you gain a card, you may discard this, to put that card into your hand or onto your deck.";
    supplyCount = 10;
    cardArt = "/img/card-img/SleighArt.jpg";
    async onPlay(player: Player): Promise<void> {
        await player.gain('horse');
        await player.gain('horse');
    }
    public static onChosen() {
        return ['horse'];
    }
    public static setup(data: any, game: Game) {
        game.players.forEach((player) => {
            player.effects.setupMultiEffect('gain', this.cardName, {
                getItems: () => player.data.hand.filter((a) => a.name === 'sleigh').map((a) => a.id),
                compatibility: {
                    duplicate: true,
                    exile: true
                },
                relevant: (ctx, tracker) => tracker.hasTrack,
                temporalRelevance: (ctx, tracker) => tracker.hasTrack,
                optional: true
            }, async (remove, tracker) => {
                let first = true;
                let cardId: string;
                while (tracker.hasTrack && (cardId = remove.additionalCtx.sleigh()) != null && (!(player.effects.inCompat && first) || await player.confirmAction(Texts.wantToDiscardAForBenefit('sleigh', `move the gained ${tracker.viewCard().name}`)))) {
                    first = false;
                    const card = player.data.hand.splice(player.data.hand.findIndex((a) => a.id === cardId), 1)[0];
                    await player.discard(card, true);
                    const option = await player.chooseOption(Texts.whatToDoWith(tracker.viewCard().name), [Texts.putItOnYourDeck, Texts.putItInYourHand] as const);
                    switch (option) {
                        case Texts.putItOnYourDeck:
                            player.lm('%p puts the %s on their deck.', tracker.viewCard().name);
                            player.deck.cards.unshift(tracker.exercise()!);
                            break;
                        case Texts.putItInYourHand:
                            player.lm('%p puts the %s into their hand.', tracker.viewCard().name);
                            player.data.hand.push(tracker.exercise()!);
                            break;
                    }
                }
            });
        });
    }
}
