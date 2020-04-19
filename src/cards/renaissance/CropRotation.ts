import Project from "../Project";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class CropRotation extends Project {
    cardArt = "/img/card-img/Crop_RotationArt.jpg";
    cardText = "At the start of your turn, you may discard a Victory card for\n" +
        "+2 Cards";
    intrinsicCost = {
        coin: 6
    };
    name = "crop rotation";
    async onPlayerJoinProject(player: Player): Promise<any> {
        player.effects.setupEffect('turnStart', 'crop rotation', {
            compatibility: {},
            temporalRelevance: () => player.data.hand.some((a) => a.types.includes('victory'))
        }, async () => {
            if (player.data.hand.some((a) => a.types.includes("victory"))) {
                const card = await player.chooseCardFromHand(Texts.discardAForBenefit('victory', 1, 'draw 2 cards'), true, (card) => card.types.includes("victory"));
                if (card) {
                    await player.discard(card, true);
                    await player.draw(2);
                }
            }
        });
    }
}