import type Player from "../../server/Player";
import Way from "../Way";
import Tracker from "../../server/Tracker";
import type {default as Card, CardImplementation} from "../Card";
import {GainRestrictions} from "../../server/GainRestrictions";
import Cost from "../../server/Cost";
import type Game from "../../server/Game";

export default class WayOfTheMouse extends Way {
    cardArt = "/img/card-img/Way_of_the_MouseArt.jpg";
    cardText = "Play the set-aside card, leaving it there.\n" +
        "---\n" +
        "Setup: Set aside an unused Action costing $2 or $3.";
    name = "way of the mouse";
    private target!: Card;
    private targetImp!: CardImplementation;
    async onWay(player: Player, ep, t): Promise<void> {
        const dup = new (this.targetImp)(player.game);
        // @ts-ignore
        dup.id = t.viewCard().id;
        const tracker = new Tracker(dup);
        tracker.loseTrack();
        // @ts-ignore
        player._duplicatedPlayArea.push(dup);
        player.lm('%p plays the set-aside %s.', this.target.name);
        await player.playCard(dup, tracker, false, false);
    }
    protected relevant(card: Tracker<Card>): boolean {
        return card.viewCard().name !== this.target.name;
    }
    public static setup(data: any, game: Game) {
        super.setup(data, game);
        data.target = this.getMyParams(game).Target;
        const instance = this.getInstance({game} as any) as WayOfTheMouse;
        instance.target = new (game.getCard(this.getMyParams(game).Target))(game);
        instance.targetImp = game.getCard(this.getMyParams(game).Target);
    }
    public static getSetupParameters() {
        return {
            'Target': GainRestrictions.instance().setMustIncludeType('action').setCostRange(Cost.create(2), Cost.create(3)).setInSupply(false).setIsAvailable(false)
        };
    }
    public static getSupplyMarkers(cardData: any): {[card: string]: string[]} | null {
        if (cardData == null) return {};
        return {
            'way of the mouse': ['Target: ' + cardData.target]
        };
    }
}