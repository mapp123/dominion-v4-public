import Card from "../Card";
import type Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import type Game from "../../server/Game";
import type Lantern from "./Lantern";
import Util from "../../Util";
import type Horn from "./Horn";
import type Tracker from "../../server/Tracker";

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
        const revealed = await player.revealTop((this.getGlobalData().lantern as Lantern).belongsToPlayer === player ? 3 : 2, true);
        const card = await player.chooseCard(Texts.chooseCardToTakeFromRevealed, revealed.map((a) => a.viewCard()), false);
        if (card) {
            player.lm('%p puts the %s in their hand.', card.name);
            const tracker = revealed.find((a) => a.viewCard().id === card.id)!;
            player.data.hand.push(tracker.exercise()!);
        }
        await player.discard(Util.filterAndExerciseTrackers(revealed), true);
        if (revealed.length === ((this.getGlobalData().lantern as Lantern).belongsToPlayer === player ? 3 : 2) && revealed.every((a) => a.viewCard().types.includes("action"))) {
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
