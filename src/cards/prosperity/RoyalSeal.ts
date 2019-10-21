import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Game from "../../server/Game";

export default class RoyalSeal extends Card {
    intrinsicTypes = ["treasure"] as const;
    name = "royal seal";
    cost = {
        coin: 5
    };
    cardText = "+$2\n---\nWhile this is in play, when you gain a card, you may put that card onto your deck.";
    supplyCount = 10;
    cardArt = "/img/card-img/Royal_SealArt.jpg";
    async onTreasure(player: Player): Promise<void> {
        player.data.money += 2;
    }
    public static setup(globalCardData: any, game: Game) {
        game.events.on('gain', async (player, tracker) => {
            if (tracker.hasTrack && player.data.playArea.find((a) => a.name === 'royal seal') != null) {
                const shouldContinue = await player.chooseOption(Texts.whatToDoWithTheGainedAForB(tracker.viewCard().name, 'royal seal'), [Texts.putItOnYourDeck, Texts.doNothing] as const);
                if (shouldContinue === 'Put It On Your Deck') {
                    player.lm('%p puts the %s on top of their deck.', tracker.viewCard().name);
                    player.deck.cards.unshift(tracker.exercise()!);
                }
            }
            return true;
        });
    }
}
