export default class Rules {
    static chooseBasicCards(chosenCards: string[]): string[] {
        return ['copper', 'silver', 'gold', 'estate', 'duchy', 'province', 'curse', ...chosenCards]
    }
}