export class Texts {
    static chooseUsername = "What would you like your username to be?";
    static chooseCardOrBuy = "Please play a treasure or buy a card...";
    static chooseActionToPlay = "Please choose an action card to play...";
    static buy = "Please buy a card...";
    static chooseCardToPlayTwice = "Please choose a card to play twice...";
    static doYouWantToReveal(card) {
        return `Do you want to reveal your ${card}?`;
    }
    static chooseCardToDiscardFor(card) {
        return `Please choose a card to discard for ${card}...`
    }
    static chooseCardToTrashFor(card) {
        return `Please choose a card to trash for ${card}...`;
    }
}