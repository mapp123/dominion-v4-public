import Util from "../Util";

export class Texts {
    static chooseUsername = "What would you like your username to be?";
    static chooseCardOrBuy = "Please play a treasure or buy a card...";
    static chooseActionToPlay = "Please choose an action card to play...";
    static buy = "Please buy a card...";
    static chooseCardToReplay = "Please choose a card to replay...";
    static chooseCardToPlayTwice = "Please choose a card to play twice...";
    static chooseCardToPlayThrice = "Please choose a card to play thrice...";
    static placeDeckIntoDiscard = "Would you like to place your deck into your discard?";
    static chooseCardToGainFromTrashed = "Please choose any number of cards to gain from the trashed cards...";
    static chooseOrderOfCards = 'Please reorder the cards:';
    static chooseCardToPutOnDeck = 'Please choose a card to put on top of your deck...';
    static chooseCardToTakeFromDiscard = 'Please choose a card to take out of your discard pile...';
    static chooseCardToTakeFromRevealed = 'Please choose a card to put in your hand from the revealed cards...';
    static chooseCardToTakeFromSetAside = 'Please choose a card to take from the set aside cards...';
    static wantBuyCoffers = 'Do you want to buy a Coffers with your extra coin?';
    static whichArtifactWouldYouLike = 'Which artifact would you like to take?';
    static trashIt = "Trash It";
    static discardIt = "Discard It";
    static discardThem = "Discard Them";
    static keepIt = "Keep It";
    static putThemOnYourDeck = "Put Them On Your Deck";
    static putItOnYourDeck = "Put It On Your Deck";
    static doNothing = "Do Nothing";
    static replayAction = "Replay an Action Card";
    static addTokenTo(mat: string) {
        return `Add a token to ${mat}`;
    }
    static trashA(type: string) {
        return `Trash A ${type}`;
    }
    static gainAFromB(a: string, b: string) {
        return `Gain a ${a} from ${b}`;
    }
    static takeArtifact(artifact: string) {
        return `Take the ${artifact}`;
    }
    static extraMoney(amount: string) {
        return `+${amount} Money`;
    }
    static extraActions(amount: string) {
        return `+${amount} Actions`;
    }
    static extraBuys(amount: string) {
        return `+${amount} Buys`;
    }
    static gain(cards: string[]) {
        return `Gain ${Util.formatCardList(cards)}`;
    }
    static drawXCards(amount: string) {
        return `Draw ${amount} cards`;
    }
    static chooseBenefitFor(a: string) {
        return `Choose benefit for ${a}...`;
    }
    static doYouWantToTrashA(a: string) {
        return `Do you want to trash a ${a}?`;
    }
    static doYouWantToPutTheAOnYourDeck(a: string) {
        return `Do you want to put the ${a} on top of your deck?`;
    }
    static areYouSureYouWantToTrash(a: string) {
        return `Are you sure you want to trash the ${a}?`;
    }
    static buyingWillUseCoffers(card: string, amountOver: number) {
        return `Buying the ${card} will use ${amountOver} coffers. Are you sure?`;
    }
    static playActionWillUseVillagers(card: string) {
        return `Playing the ${card} will use a villager. Continue?`;
    }
    static chooseCardToTrashForge(money: string | number) {
        return `Please choose a card to trash for forge. You are currently at ${money} Money.`;
    }
    static discardForBenefit(benefit: string, number = 1) {
        return `Choose ${number === 1 ? "a" : Util.numeral(number)} card${number > 1 ? "s" : ""} to discard. You'll get ${benefit} if you do.`;
    }
    static discardAForBenefit(type: string, benefit: string) {
        return `Choose ${type} to discard. You'll get ${benefit} if you do.`;
    }
    static doYouWantToDiscardAnAForB(a: string, b: string) {
        return `Do you want to discard a ${a} for ${b}?`;
    }
    static chooseAToDuplicateWithB(a: string, b: string) {
        return `Please choose a ${a} to duplicate with ${b}...`;
    }
    static chooseACardThatACannotBuyThisTurn(a: string) {
        return `Please choose a card that ${a} cannot buy this turn...`;
    }
    static whatToDoWith(card: string) {
        return `What would you like to do with the ${card}?`;
    }
    static whatToDoWithTheGainedAForB(a: string, b: string) {
        return Texts.whatToDoWith(`the gained ${a} for ${b}`);
    }
    static wantToDraw(card: string) {
        return `Do you want to draw the ${card}?`;
    }
    static chooseATreasureToTrashFor(a: string) {
        return `Choose a treasure to trash for ${a}...`;
    }
    static shouldADiscardTheBOnTopOfTheirDeck(a: string, b: string) {
        return `Should ${a} discard the ${b} on top of their deck?`;
    }
    static chooseAnAToTrashForB(a: string, b: string) {
        return `Please choose an ${a} to trash for ${b}...`;
    }
    static chooseVictoryToTopDeckFor(card: string) {
        return `Please choose a victory to place on top of your deck for ${card}...`;
    }
    static playCardFromDiscard(card: string) {
        return `Would you like to play the ${card} you discarded?`;
    }
    static chooseCardToMoveFromDiscardToDeck(card: string) {
        return `Please choose a card to take from your discard and place on top of your deck for ${card}...`;
    }
    static doYouWantToReveal(card: string) {
        return `Do you want to reveal your ${card}?`;
    }
    static chooseCardToDiscardFor(card: string) {
        return `Please choose a card to discard for ${card}...`;
    }
    static chooseCardToTrashFor(card: string) {
        return `Please choose a card to trash for ${card}...`;
    }
    static chooseCardToGainFor(card: string) {
        return `Please choose a card to gain for ${card}...`;
    }
    static wouldYouLikeToSetAsideThe(card: string, withCard: string){
        return `Would you like to set aside the ${card} with ${withCard}?`;
    }
    static whatToDoWithCards(cards: string) {
        return `Choose what to do with ${cards}...`;
    }
}