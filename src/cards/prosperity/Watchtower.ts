import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Game from "../../server/Game";

export default class Watchtower extends Card {
    types = ["action","reaction"] as const;
    name = "watchtower";
    cost = {
        coin: 3
    };
    cardText = "Draw until you have 6 cards in hand.\n" +
        "When you gain a card, you may reveal this from your hand, to either trash that card or put it onto your deck.";
    supplyCount = 10;
    cardArt = "/img/card-img/WatchtowerArt.jpg";
    async onAction(player: Player): Promise<void> {
        while (player.data.hand.length < 6 && player.deck.peek()) {
            player.draw();
        }
    }
    static setup(cardData: any, game: Game) {
        game.events.on('gain', async (player, card, hasTrack, loseTrack) => {
            if (player.data.hand.some((a) => a.name === 'watchtower') && hasTrack.hasTrack) {
                let option = await player.chooseOption(Texts.whatToDoWithTheGainedAForB(card.name, 'watchtower'), [Texts.trashIt, Texts.putItOnYourDeck, Texts.doNothing] as const);
                if (option !== 'Do Nothing') {
                    player.lm('%p reveals a watchtower.');
                    switch (option) {
                        case Texts.putItOnYourDeck:
                            player.lm('%p puts the %s on top of their deck.', card.name);
                            player.deck.cards.unshift(card);
                            loseTrack();
                            break;
                        case Texts.trashIt:
                            await player.trash(card);
                            loseTrack();
                            break;
                    }
                }
            }
            return true;
        });
    }
}
