import Card from "./Card";
import type Player from "../server/Player";
import type Game from "../server/Game";
import type {GainRestrictions} from "../server/GainRestrictions";

export default abstract class Project extends Card {
    static descriptionSize = 30;
    intrinsicTypes = ["project"] as const;
    randomizable = false;
    supplyCount = 0;
    isCard = false;
    abstract onPlayerJoinProject(player: Player): Promise<any>;
    playersJoined: Player[] = [];
    public static createSupplyPiles(playerCount: number, game: Game): Array<{identifier: string; pile: Card[]; identity: Card; displayCount: boolean}> {
        return [{
            identifier: this.cardName,
            // @ts-ignore
            pile: [new this(game)],
            // @ts-ignore
            identity: new this(game),
            displayCount: false
        }];
    }
    protected static getInstance(player: Player): Project {
        return player.game.supply.data.piles.find((a) => a.identifier === this.cardName)!.identity as Project;
    }
    public static async onBuy(player: Player): Promise<Card | null> {
        const instance: Project = player.game.supply.data.piles.find((a) => a.identifier === this.cardName)!.identity as Project;
        await instance.onPlayerJoinProject(player);
        instance.playersJoined.push(player);
        return null;
    }
    public static getExtraRestrictions(cardData: any, player: Player, restrictions: GainRestrictions): GainRestrictions {
        if (this.getInstance(player).playersJoined.includes(player)) {
            restrictions.addBannedCard(this.cardName);
        }
        return restrictions;
    }
}