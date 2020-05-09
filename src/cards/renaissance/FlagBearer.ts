import Card from "../Card";
import type Player from "../../server/Player";

export default class FlagBearer extends Card {
    intrinsicTypes = ["action"] as const;
    name = "flag bearer";
    intrinsicCost = {
        coin: 4
    };
    cardText = "+$2\n" +
        "---\n" +
        "When you gain or trash this, take the Flag.";
    supplyCount = 10;
    cardArt = "/img/card-img/Flag_BearerArt.jpg";
    async onPlay(player: Player): Promise<void> {
        await player.addMoney(2);
    }
    onTrashSelf(player: Player): Promise<void> | void {
        player.game.giveArtifactTo('flag', player);
    }

    onGainSelf(player: Player): Promise<void> | void {
        player.game.giveArtifactTo('flag', player);
    }

    public static onChosen(): string[] {
        return ['flag'];
    }
}
