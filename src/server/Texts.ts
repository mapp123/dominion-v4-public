export class Texts {
    static chooseUsername = "What would you like your username to be?";
    static chooseCardOrBuy = "Please play a treasure or buy a card...";
    static chooseActionToPlay = "Please choose an action card to play...";
    static buy = "Please buy a card...";
    static chooseCardToPlayTwice = "Please choose a card to play twice...";
    static placeDeckIntoDiscard = "Would you like to place your deck into your discard?";
    static chooseCardToGainFromTrashed = "Please choose any number of cards to gain from the trashed cards...";
    static chooseOrderOfCards = 'Please reorder the cards:';
    static chooseCardToPutOnDeck = 'Please choose a card to put on top of your deck...';
    static chooseACardThatACannotBuyThisTurn(a) {
        return `Please choose a card that ${a} cannot buy this turn...`;
    }
    static whatToDoWith(card) {
        return `What would you like to do with the ${card}?`;
    }
    static whatToDoWithTheGainedAForB(a, b) {
        return Texts.whatToDoWith(`the gained ${a} for ${b}`);
    }
    static wantToDraw(card) {
        return `Do you want to draw the ${card}?`;
    }
    static chooseATreasureToTrashFor(a) {
        return `Choose a treasure to trash for ${a}...`;
    }
    static shouldADiscardTheBOnTopOfTheirDeck(a, b) {
        return `Should ${a} discard the ${b} on top of their deck?`;
    }
    static chooseAnAToTrashForB(a, b) {
        return `Please choose an ${a} to trash for ${b}...`;
    }
    static chooseVictoryToTopDeckFor(card) {
        return `Please choose a victory to place on top of your deck for ${card}...`;
    }
    static playCardFromDiscard(card) {
        return `Would you like to play the ${card} you discarded?`;
    }
    static chooseCardToMoveFromDiscardToDeck(card) {
        return `Please choose a card to take from your discard and place on top of your deck for ${card}...`;
    }
    static doYouWantToReveal(card) {
        return `Do you want to reveal your ${card}?`;
    }
    static chooseCardToDiscardFor(card) {
        return `Please choose a card to discard for ${card}...`;
    }
    static chooseCardToTrashFor(card) {
        return `Please choose a card to trash for ${card}...`;
    }
    static chooseCardToGainFor(card) {
        return `Please choose a card to gain for ${card}...`;
    }
}