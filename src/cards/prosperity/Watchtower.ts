import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Game from "../../server/Game";

export default class Watchtower extends Card {
    static descriptionSize = 57;
    intrinsicTypes = ["action","reaction"] as const;
    name = "watchtower";
    intrinsicCost = {
        coin: 3
    };
    cardText = "Draw until you have 6 cards in hand.\n" +
        "---\n" +
        "When you gain a card, you may reveal this from your hand, to either trash that card or put it onto your deck.";
    supplyCount = 10;
    cardArt = "/img/card-img/WatchtowerArt.jpg";
    async onAction(player: Player): Promise<void> {
        while (player.data.hand.length < 6 && await player.deck.peek()) {
            await player.draw();
        }
    }
    static setup(cardData: any, game: Game) {
        game.players.forEach((player) => {
            player.effects.setupEffect('gain', 'watchtower', () => !player.data.hand.some((a) => a.name === 'watchtower'), async (remove, tracker) => {
                const option = await player.chooseOption(Texts.whatToDoWithTheGainedAForB(tracker.viewCard().name, 'watchtower'), [Texts.trashIt, Texts.putItOnYourDeck, Texts.doNothing] as const);
                if (option !== 'Do Nothing') {
                    player.lm('%p reveals a watchtower.');
                    switch (option) {
                        case Texts.putItOnYourDeck:
                            player.lm('%p puts the %s on top of their deck.', tracker.viewCard().name);
                            player.deck.cards.unshift(tracker.exercise()!);
                            break;
                        case Texts.trashIt:
                            await player.trash(tracker.exercise()!);
                            break;
                    }
                }
            });
        });
    }
}
