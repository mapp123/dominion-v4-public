import Card from "../Card";
import type Player from "../../server/Player";
import type Game from "../../server/Game";
import {Texts} from "../../server/Texts";

export default class BlackCat extends Card {
    intrinsicTypes = ["action","attack","reaction"] as const;
    name = "black cat";
    intrinsicCost = {
        coin: 2
    };
    cardText = "+2 Cards\n" +
        "If it isn't your turn, each other player gains a Curse.\n" +
        "---\n" +
        "When another player gains a Victory card, you may play this from your hand.";
    supplyCount = 10;
    cardArt = "/img/card-img/Black_CatArt.jpg";
    async onPlay(player: Player, exemptPlayers: Player[]): Promise<void> {
        await player.draw(2, true);
        if (player.game.currentPlayer.id !== player.id) {
            await player.attackOthers(exemptPlayers, async (p) => {
                await p.gain('curse');
            });
        }
    }
    public static setup(data, game: Game) {
        game.players.forEach((player) => {
            game.effects.setupMultiGameEffect('gain', this.cardName, {
                player,
                compatibility: {},
                relevant: (p, ctx, card) => p.id !== player.id && card.viewCard().types.includes("victory"),
                optional: true,
                getItems: () => player.data.hand.filter((a) => a.name === 'black cat').map((a) => a.id)
            }, async (remove) => {
                let first = true;
                let nextId: string;
                while ((nextId = remove.additionalCtx['black cat']()) != null && ((first && !player.game.effects.inCompat) || await player.confirmAction(Texts.doYouWantToPlay('black cat')))) {
                    first = false;
                    const card = player.data.hand.splice(player.data.hand.findIndex((a) => a.id === nextId), 1)[0];
                    player.data.playArea.push(card);
                    await player.playCard(card, null);
                }
            });
        });
    }
}
