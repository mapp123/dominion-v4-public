import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import {GainRestrictions} from "../../server/GainRestrictions";
import Tracker from "../../server/Tracker";

export default class Teacher extends Card {
    static descriptionSize = 45;
    intrinsicTypes = ["action","reserve"] as const;
    name = "teacher";
    intrinsicCost = {
        coin: 6
    };
    cardText = "Put this on your Tavern mat.\n" +
        "---\n" +
        "At the start of your turn, you may call this, to move your +1 Card, +1 Action, +1 Buy, or +$1 token to an Action supply pile you have no tokens on. (When you play a card from that pile, you first get that bonus.)\n" +
        "(This is not in the Supply.)";
    supplyCount = 10;
    cardArt = "/img/card-img/TeacherArt.jpg";
    randomizable = false;
    static inSupply = false;
    cb: (() => Promise<boolean>) | null = null;
    async onAction(player: Player, exemptPlayers, tracker: Tracker<this>): Promise<void> {
        if (tracker.hasTrack) {
            player.data.tavernMat.push({
                card: tracker.exercise()!,
                canCall: false
            });
            this.cb = async () => {
                player.data.tavernMat.forEach((a) => {
                    if (a.card.id === tracker.viewCard().id) {
                        a.canCall = true;
                    }
                });
                player.events.on('decision', async () => {
                    player.data.tavernMat.forEach((a) => {
                        if (a.card.id === tracker.viewCard().id) {
                            a.canCall = false;
                        }
                    });
                    return false;
                });
                return true;
            };
            player.events.on('turnStart', this.cb);
        }
    }
    async onCall(player: Player): Promise<void> {
        if (this.cb) {
            player.events.off('turnStart', this.cb);
        }
        const tokenLocations = Object.values(player.data.tokens);
        const restrictions = GainRestrictions.instance();
        this.game.supply.data.piles
            .filter((a) => tokenLocations.includes(a.identifier) || !a.inSupply)
            .map((a) => (a.pile.length > 0 ? a.pile[a.pile.length - 1] : a.identity).name)
            .forEach((a) => restrictions.addBannedCard(a));
        const card = await player.chooseGain(Texts.whereDoYouWantToken, false, restrictions, 'none');
        if (card) {
            const token = await player.chooseOption(Texts.whichToken, [Texts.plusOneCard, Texts.plusOneAction, Texts.plusOneBuy, Texts.plusOneMoney] as const);
            player.lm('%p puts their %s token on %s.', token, card.getPileIdentifier());
            switch (token) {
                case Texts.plusOneCard:
                    player.data.tokens.extraCard = card.getPileIdentifier();
                    break;
                case Texts.plusOneAction:
                    player.data.tokens.extraAction = card.getPileIdentifier();
                    break;
                case Texts.plusOneBuy:
                    player.data.tokens.extraBuy = card.getPileIdentifier();
                    break;
                case Texts.plusOneMoney:
                    player.data.tokens.extraMoney = card.getPileIdentifier();
                    break;
            }
        }
    }
}
