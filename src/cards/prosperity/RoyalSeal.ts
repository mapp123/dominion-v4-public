import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Game from "../../server/Game";

export default class RoyalSeal extends Card {
    types = ["treasure"] as const;
    name = "royal seal";
    cost = {
        coin: 5
    };
    cardText = "+$2\nWhile this is in play, when you gain a card, you may put that card onto your deck.";
    supplyCount = 10;
    cardArt = "/img/card-img/Royal_SealArt.jpg";
    async onTreasure(player: Player): Promise<void> {
        player.data.money += 2;
    }
    public static setup(globalCardData: any, game: Game) {
        game.events.on('gain', async (player, card, hasTrack, loseTrack) => {
            if (hasTrack.hasTrack && player.data.playArea.find((a) => a.name === 'royal seal') != null) {
                const shouldContinue = await player.chooseOption(Texts.whatToDoWithTheGainedAForB(card.name, 'royal seal'), ['Put It On Your Deck', 'Do Nothing'] as const);
                if (shouldContinue === 'Put It On Your Deck') {
                    player.lm('%p puts the %s on top of their deck.', card.name);
                    loseTrack();
                    player.deck.cards.unshift(card);
                }
            }
            return true;
        });
    }
}
