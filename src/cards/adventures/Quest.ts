import type Player from "../../server/Player";
import Event from "../Event";
import {Texts} from "../../server/Texts";

export default class Quest extends Event {
    cardArt = "/img/card-img/QuestArt.jpg";
    cardText = "You may discard an Attack, two Curses, or six cards. If you do, gain a Gold.";
    intrinsicCost = {
        coin: 0
    };
    name = "quest";
    async onPurchase(player: Player): Promise<any> {
        const choice = await player.chooseOption(Texts.chooseOptionFor(this.name), [Texts.discardA('attack'), Texts.discardXYs('2', 'curses'), Texts.discardXCards('6')]);
        switch (choice) {
            case Texts.discardA('attack'):
                const attack = await player.chooseCardFromHand(Texts.chooseCardToDiscardFor(this.name), false, (card) => card.types.includes("attack"));
                if (attack) {
                    await player.discard(attack, true);
                    await player.gain('gold');
                }
                else {
                    player.lm('%p does not have an attack to discard.');
                }
                break;
            case Texts.discardXYs('2', 'curses'):
                const curses = player.data.hand.filter((a) => a.name === 'curse');
                if (curses.length > 1) {
                    const curse1 = player.data.hand.splice(player.data.hand.indexOf(curses[0]), 1)[0];
                    const curse2 = player.data.hand.splice(player.data.hand.indexOf(curses[1]), 1)[0];
                    await player.discard([curse1, curse2], true);
                    await player.gain('gold');
                }
                else {
                    for (const c of curses) {
                        player.data.hand.splice(player.data.hand.indexOf(c), 1);
                        await player.discard(c, true);
                    }
                    player.lm('%p does not have any more curses to discard.');
                }
                break;
            case Texts.discardXCards('6'):
                let cardsDiscarded = 0;
                while (cardsDiscarded < 6) {
                    const card = await player.chooseCardFromHand(Texts.chooseCardToDiscardFor(this.name));
                    if (card) {
                        cardsDiscarded++;
                        await player.discard(card, true);
                    }
                    else {
                        break;
                    }
                }
                if (cardsDiscarded >= 6) {
                    await player.gain('gold');
                }
                else {
                    player.lm('%p does not have any more cards to discard.');
                }
                break;
        }
    }
}