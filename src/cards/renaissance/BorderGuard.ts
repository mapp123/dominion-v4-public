import Card from "../Card";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";
import Game from "../../server/Game";
import Lantern from "./Lantern";
import Util from "../../Util";
import Horn from "./Horn";

export default class BorderGuard extends Card {
    types = ["action"] as const;
    name = "border guard";
    cost = {
        coin: 2
    };
    cardText = "+1 Action\n" +
        "Reveal the top 2 cards of your deck. Put one into your hand and discard the other. If both were Actions, take the Lantern or Horn.";
    supplyCount = 10;
    cardArt = "/img/card-img/Border_GuardArt.jpg";
    async onAction(player: Player): Promise<void> {
        player.data.actions += 1;
        const revealed = [player.deck.pop(), player.deck.pop(), (this.getGlobalData().lantern as Lantern).belongsToPlayer === player ? player.deck.pop() : null].filter((a) => a) as Card[];
        player.lm('%p reveals %s.', Util.formatCardList(revealed.map((a) => a.name)));
        const card = await player.chooseCard(Texts.chooseCardToTakeFromRevealed, revealed, false);
        if (card) {
            player.lm('%p puts the %s in their hand.', card.name);
            player.data.hand.push(card);
        }
        const toDiscard = revealed.filter((a) => a != card);
        await player.discard(toDiscard, true);
        if (revealed.length === ((this.getGlobalData().lantern as Lantern).belongsToPlayer === player ? 3 : 2) && revealed.every((a) => a.types.includes("action"))) {
            const choice = await player.chooseOption(Texts.whichArtifactWouldYouLike, ['lantern', 'horn'] as const);
            player.game.giveArtifactTo(choice, player);
        }
    }
    async onDiscardFromPlay(player: Player, hasTrack: { hasTrack: boolean }, loseTrack: () => {}): Promise<any> {
        const horn = this.getGlobalData().horn as Horn;
        if (hasTrack.hasTrack && horn.belongsToPlayer === player && horn.lastUsedOn < player.turnNumber) {
            horn.lastUsedOn = player.turnNumber;
            if (await player.confirmAction(Texts.doYouWantToPutTheAOnYourDeck('border guard'))) {
                loseTrack();
                player.deck.cards.unshift(this);
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
