import Card from "../Card";
import type Player from "../../server/Player";
import Cost, {CostResult} from "../../server/Cost";

export default class Giant extends Card {
    static descriptionSize = 51;
    intrinsicTypes = ["action","attack"] as const;
    name = "giant";
    tokens = ["journeyToken"] as const;
    intrinsicCost = {
        coin: 5
    };
    cardText = "Turn your Journey token over (it starts face up). If it's face down, +$1. If it's face up, +$5, and each other player reveals the top card of his deck, trashes it if it costs from $3 to $6, and otherwise discards it and gains a Curse.";
    supplyCount = 10;
    cardArt = "/img/card-img/800px-GiantArt.jpg";
    async onPlay(player: Player, exemptPlayers: Player[]): Promise<void> {
        player.data.tokens.journeyToken = player.data.tokens.journeyToken === 'UP' ? 'DOWN' : 'UP';
        if (player.data.tokens.journeyToken === 'DOWN') {
            await player.addMoney(1);
            return;
        }
        await player.addMoney(5);
        await player.attackOthersInSteps<Card | undefined>(exemptPlayers, [async (p) => {
            const topCards = await p.revealTop(1, true);
            return topCards.length === 0 || !topCards[0].hasTrack ? undefined : topCards[0].exercise()!;
        }, async (p, topCard) => {
            if (topCard == null) {
                return;
            }
            if (topCard.cost.compareTo(Cost.create(2)) === CostResult.GREATER_THAN && topCard.cost.compareTo(Cost.create(7)) === CostResult.LESS_THAN) {
                await p.trash(topCard, false);
                await p.lm('%p trashes the revealed %s.', topCard.name);
            }
            else {
                await p.discard(topCard, false);
                await p.lm('%p discards the revealed %s, gaining a curse.', topCard.name);
                await p.gain('curse', undefined, false);
            }
        }]);
    }
}
