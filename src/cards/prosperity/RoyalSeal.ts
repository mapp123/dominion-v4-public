import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import type Game from "../../server/Game";

export default class RoyalSeal extends Card {
    intrinsicTypes = ["treasure"] as const;
    name = "royal seal";
    intrinsicCost = {
        coin: 5
    };
    cardText = "+$2\n---\nWhile this is in play, when you gain a card, you may put that card onto your deck.";
    supplyCount = 10;
    cardArt = "/img/card-img/Royal_SealArt.jpg";
    intrinsicValue = 2;
    async onPlay(player: Player): Promise<void> {
        player.data.money += 2;
    }
    public static setup(globalCardData: any, game: Game) {
        game.players.forEach((player) => {
            player.effects.setupEffect('gain', 'royal seal', {
                compatibility: {},
                relevant: (tracker) => tracker.hasTrack && player.data.playArea.some((a) => a.name === 'royal seal'),
                duplicate: () => player.data.playArea.filter((a) => a.name === 'royal seal').map((a) => a.id)
            }, async (remove, tracker) => {
                if (tracker.hasTrack) {
                    const shouldContinue = await player.chooseOption(Texts.whatToDoWithTheGainedAForB(tracker.viewCard().name, 'royal seal'), [Texts.putItOnYourDeck, Texts.doNothing] as const);
                    if (shouldContinue === 'Put It On Your Deck') {
                        player.lm('%p puts the %s on top of their deck.', tracker.viewCard().name);
                        player.deck.cards.unshift(tracker.exercise()!);
                    }
                    else {
                        remove.skipDuplicates();
                    }
                }
            });
        });
    }
}
