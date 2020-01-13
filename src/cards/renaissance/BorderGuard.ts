import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Game from "../../server/Game";
import Lantern from "./Lantern";
import Util from "../../Util";
import Horn from "./Horn";
import Tracker from "../../server/Tracker";

export default class BorderGuard extends Card {
    intrinsicTypes = ["action"] as const;
    name = "border guard";
    intrinsicCost = {
        coin: 2
    };
    cardText = "+1 Action\n" +
        "Reveal the top 2 cards of your deck. Put one into your hand and discard the other. If both were Actions, take the Lantern or Horn.";
    supplyCount = 10;
    cardArt = "/img/card-img/Border_GuardArt.jpg";
    async onAction(player: Player): Promise<void> {
        player.data.actions += 1;
        const revealed = [await player.deck.pop(), await player.deck.pop(), (this.getGlobalData().lantern as Lantern).belongsToPlayer === player ? await player.deck.pop() : null].filter((a) => a) as Card[];
        const kept = await player.reveal(revealed);
        player.lm('%p reveals %s.', Util.formatCardList(kept.map((a) => a.name)));
        const card = await player.chooseCard(Texts.chooseCardToTakeFromRevealed, kept, false);
        if (card) {
            player.lm('%p puts the %s in their hand.', card.name);
            player.data.hand.push(card);
        }
        const toDiscard = kept.filter((a) => a != card);
        await player.discard(toDiscard, true);
        if (kept.length === ((this.getGlobalData().lantern as Lantern).belongsToPlayer === player ? 3 : 2) && kept.every((a) => a.types.includes("action"))) {
            const choice = await player.chooseOption(Texts.whichArtifactWouldYouLike, ['lantern', 'horn'] as const);
            player.game.giveArtifactTo(choice, player);
        }
    }

    async onDiscardFromPlay(player: Player, tracker: Tracker<Card>): Promise<any> {
        const horn = this.getGlobalData().horn as Horn;
        if (tracker.hasTrack && horn.belongsToPlayer === player && horn.lastUsedOn < player.turnNumber) {
            horn.lastUsedOn = player.turnNumber;
            if (await player.confirmAction(Texts.doYouWantToPutTheAOnYourDeck('border guard'))) {
                player.deck.cards.unshift(tracker.exercise()!);
            }
        }
    }

    public static setup(globalCardData: any, game: Game) {
        globalCardData.lantern = game.getArtifact('lantern') as Lantern;
        globalCardData.horn = game.getArtifact('horn') as Lantern;
    }
    public static onChosen(): string[] {
        return ['lantern', 'horn'];
    }
}
