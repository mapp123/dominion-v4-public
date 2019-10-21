import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Game from "../../server/Game";

export default class Mint extends Card {
    intrinsicTypes = ["action"] as const;
    name = "mint";
    cost = {
        coin: 5
    };
    cardText = "You may reveal a Treasure card from your hand. Gain a copy of it.\n" +
        "---\n" +
        "When you buy this, trash all Treasures you have in play.";
    supplyCount = 10;
    cardArt = "/img/card-img/MintArt.jpg";
    async onAction(player: Player): Promise<void> {
        const card = await player.chooseCard(Texts.chooseAToDuplicateWithB('treasure', 'mint'), player.data.hand, true, (card) => card.types.includes("treasure"));
        if (card) {
            await player.reveal([card]);
            await player.gain(card.name);
        }
    }
    public static setup(globalCardData: any, game: Game) {
        game.events.on('buy', async (player, card) => {
            if (card === 'mint') {
                player.lm('%p trashes all treasures in play.');
                let cardsToTrash = player.data.playArea.filter((a) => a.types.includes("treasure"));
                player.data.playArea = player.data.playArea.filter((a) => !cardsToTrash.includes(a));
                await Promise.all(cardsToTrash.map((a) => player.trash(a, false)));
            }
            return true;
        });
    }
}
