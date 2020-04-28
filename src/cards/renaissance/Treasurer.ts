import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class Treasurer extends Card {
    intrinsicTypes = ["action"] as const;
    name = "treasurer";
    intrinsicCost = {
        coin: 5
    };
    cardText = "+$3\n" +
        "Choose one: Trash a Treasure from your hand; or gain a Treasure from the trash to your hand; or take the Key.";
    supplyCount = 10;
    cardArt = "/img/card-img/TreasurerArt.jpg";
    async onPlay(player: Player): Promise<void> {
        player.data.money += 3;
        const option = await player.chooseOption(Texts.chooseBenefitFor('treasurer'), [
            Texts.trashA('treasure'),
            Texts.gainAFromB('treasure', 'the trash'),
            Texts.takeArtifact('key')
        ] as const);
        switch (option) {
            case Texts.trashA('treasure'):
                const trashCard = await player.chooseCardFromHand(Texts.chooseATreasureToTrashFor('treasurer'));
                if (trashCard) {
                    await player.trash(trashCard);
                }
                break;
            case Texts.gainAFromB('treasure', 'the trash'):
                const gainCard = await player.chooseCard(Texts.chooseCardToGainFromTrashed, player.game.trash.filter((a) => a.types.includes("treasure")));
                if (gainCard) {
                    player.game.trash.splice(player.game.trash.findIndex((a) => a.id === gainCard.id), 1);
                    await player.gain(gainCard.name, gainCard, true, 'hand');
                }
                break;
            case Texts.takeArtifact('key'):
                player.game.giveArtifactTo('key', player);
                break;
        }
    }
    static onChosen() {
        return ['key'];
    }
}
