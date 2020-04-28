import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import type Game from "../../server/Game";

export default class Mint extends Card {
    intrinsicTypes = ["action"] as const;
    name = "mint";
    intrinsicCost = {
        coin: 5
    };
    cardText = "You may reveal a Treasure card from your hand. Gain a copy of it.\n" +
        "---\n" +
        "When you buy this, trash all Treasures you have in play.";
    supplyCount = 10;
    cardArt = "/img/card-img/MintArt.jpg";
    async onPlay(player: Player): Promise<void> {
        const card = await player.chooseCard(Texts.chooseAToDuplicateWithB('treasure', 'mint'), player.data.hand, true, (card) => card.types.includes("treasure"));
        if (card) {
            await player.reveal([card]);
            await player.gain(card.name);
        }
    }
    public static setup(globalCardData: any, game: Game) {
        game.players.forEach((player) => {
            player.effects.setupEffect('buy', 'mint', {
                compatibility: {
                    hovel: true,
                    hoard: true
                },
                relevant: (card) => card === 'mint'
            }, async () => {
                player.lm('%p trashes all treasures in play.');
                const cardsToTrash = player.data.playArea.filter((a) => a.types.includes("treasure"));
                player.data.playArea = player.data.playArea.filter((a) => !cardsToTrash.includes(a));
                await Promise.all(cardsToTrash.map((a) => player.trash(a, false)));
            });
        });
    }
}
