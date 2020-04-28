import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Util from "../../Util";
import Cost from "../../server/Cost";

export default class Rogue extends Card {
    static descriptionSize = 49;
    intrinsicTypes = ["action","attack"] as const;
    name = "rogue";
    intrinsicCost = {
        coin: 5
    };
    cardText = "+$2\n" +
        "If there are any cards in the trash costing from $3 to $6, gain one of them. Otherwise, each other player reveals the top 2 cards of their deck, trashes one of them costing from $3 to $6, and discards the rest.";
    supplyCount = 10;
    cardArt = "/img/card-img/RogueArt.jpg";
    async onPlay(player: Player, exemptPlayers: Player[]): Promise<void> {
        player.data.money += 2;
        const lowerLimit = Cost.create(3);
        const upperLimit = Cost.create(6);
        if (player.game.trash.some((a) => a.cost.isInRange(lowerLimit, upperLimit))) {
            const gainCard = await player.chooseCard(Texts.chooseCardToGainFor('rogue'), Util.deduplicateByName(player.game.trash.filter((a) => a.cost.isInRange(lowerLimit, upperLimit))));
            if (gainCard) {
                player.game.trash.splice(player.game.trash.indexOf(gainCard), 1);
                await player.gain(gainCard.name, gainCard);
            }
        }
        else {
            await player.attackOthers(exemptPlayers, async (p) => {
                const revealed = await p.revealTop(2);
                const cardChosen = await p.chooseCard(Texts.chooseCardToTrashFor('rogue'), revealed.filter((a) => a.viewCard().cost.isInRange(lowerLimit, upperLimit)).map((a) => a.viewCard()));
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
