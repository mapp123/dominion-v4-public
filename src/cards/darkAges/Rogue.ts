import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";

export default class Rogue extends Card {
    intrinsicTypes = ["action","attack"] as const;
    name = "rogue";
    cost = {
        coin: 5
    };
    cardText = "+$2\n" +
        "If there are any cards in the trash costing from $3 to $6, gain one of them. Otherwise, each other player reveals the top 2 cards of their deck, trashes one of them costing from $3 to $6, and discards the rest.";
    supplyCount = 10;
    cardArt = "/img/card-img/RogueArt.jpg";
    async onAction(player: Player, exemptPlayers: Player[]): Promise<void> {
        player.data.money += 2;
        if (player.game.trash.some((a) => a.cost.coin >= 3 && a.cost.coin <= 6)) {
            const gainCard = await player.chooseCard(Texts.chooseCardToGainFor('rogue'), Util.deduplicateByName(player.game.trash.filter((a) => a.cost.coin >= 3 && a.cost.coin <= 6)));
            if (gainCard) {
                player.game.trash.splice(player.game.trash.indexOf(gainCard), 1);
                await player.gain(gainCard.name, gainCard);
            }
        }
        else {
            await player.attackOthers(exemptPlayers, async (p) => {
                const revealed = await p.revealTop(2);
                const cardChosen = await p.chooseCard(Texts.chooseCardToTrashFor('rogue'), revealed.filter((a) => a.viewCard().cost.coin >= 3 && a.viewCard().cost.coin <= 6).map((a) => a.viewCard()));
                if (cardChosen) {
                    const tracker = revealed.find((a) => a.viewCard().id === cardChosen.id)!;
                    if (tracker.hasTrack) {
                        await p.trash(tracker.exercise()!);
                    }
                }
                await p.discard(revealed.filter((a) => a.hasTrack).map((a) => a.exercise()!));
            });
        }
    }
}