import v4 = require("uuid/v4");
import Deck from "./Deck";
import {Socket} from "socket.io";
import Game from "./Game";
import createPlayerData from "../createPlayerData";
import Copper from "../cards/base/Copper";
import Estate from "../cards/base/Estate";
import {Decision, DecisionResponseType, DecisionValidators} from "./Decision";
import {format} from "util";
import {StructError} from "superstruct";
import {GainRestrictions} from "./GainRestrictions";
import Card from "../cards/Card";
import {Texts} from "./Texts";
import CardRegistry from "../cards/CardRegistry";
import {PlayerEvents} from "./Events";

export default class Player {
    id = v4();
    deck = new Deck();
    private _currentSocket: Socket | null = null;
    username = '';
    private waitingForResponse = false;
    data = createPlayerData();
    private decisionCallbacks: {
        [key: string]: Array<(response: any) => any> | undefined
    } = {};
    private pendingDecisions: Array<Decision> = [];
    turnNumber = 0;
    phase = 'cleanup';
    game: Game;
    events: PlayerEvents = new PlayerEvents();
    private _nextDecisionId = 0;
    get nextDecisionId(): string {
        return "" + this._nextDecisionId++;
    }
    constructor(game: Game) {
        this.game = game;
        this.deck.discard = [
            new Copper(this.game),
            new Copper(this.game),
            new Copper(this.game),
            new Copper(this.game),
            new Copper(this.game),
            new Copper(this.game),
            new Copper(this.game),
            new Estate(this.game),
            new Estate(this.game),
            new Estate(this.game)
        ];
        this.draw(5)
    }
    draw(amount = 1) {
        for (let i = 0; i < amount; i++) {
            const card = this.deck.draw();
            if (card) {
                this.data.hand.push(card);
            }
            else {
                break;
            }
        }
    }
    get allCards() {
        return [...this.deck.deckAndDiscard, ...this.data.hand, ...this.data.playArea];
    }
    get currentSocket() {
        return this._currentSocket;
    }
    syncHalted = false;
    async haltSync(exec: () => Promise<any>) {
        this.syncHalted = true;
        await exec();
        this.syncHalted = false;
    }
    set currentSocket(socket: Socket | null) {
        this._currentSocket = socket;
        if (socket == null) {
            return;
        }
        socket.emit('playerState', this.data.getState());
        this.data.onAction((action) => {
            socket.emit('playerStateUpdate', action);
            return true;
        });
        this.game.supply.data.onAction((action) => {
            socket.emit('supplyUpdate', action);
            return true;
        });
        socket.on('fetchSupply', (returnTo) => {
            socket.emit(returnTo, this.game.supply.data.getState());
        });
        socket.on('decisionResponse', (decisionId, response) => {
            const decision = this.pendingDecisions.find((a) => a.id === decisionId);
            if (!decision) {
                console.log('Attempt to respond to a undefined decision, return');
                return;
            }
            let r;
            try {
                r = DecisionValidators[decision.decision](this.game, decision, response);
            }
            catch (e) {
                if (e.errors) {
                    console.error(`Error validating ${JSON.stringify(response)}: ${e.errors[0].message}`);
                }
                // We have a problem with the response, reemit the decision for another try
                this.emitNextDecision();
                return;
            }
            const callbacks = this.decisionCallbacks[decisionId];
            if (callbacks) {
                callbacks.forEach((a) => {
                    try {
                        a(r);
                    }
                    catch (e) {
                        console.error("An error was thrown during execution of a decision callback:");
                        console.error(e);
                    }
                });
            }
            // Prevent duplicate decisionResponse
            delete this.decisionCallbacks[decisionId];
            this.waitingForResponse = false;
            this.pendingDecisions.shift();
            if (this.pendingDecisions.length) {
                this.emitNextDecision();
            }
        });
        socket.on('startGame', () => {
            this.game.start();
        });
        if (this.pendingDecisions.length) {
            this.emitNextDecision();
        }
    }
    makeDecision<T extends Decision>(decision: T): Promise<DecisionResponseType[T['decision']]> {
        return new Promise((f,r) => {
            this.pendingDecisions.push(decision);
            const toPush = this.decisionCallbacks[decision.id] || [];
            toPush.push(f);
            this.decisionCallbacks[decision.id] = toPush;
            if (!this.waitingForResponse && this.currentSocket && this.currentSocket.connected) {
                this.emitNextDecision();
            }
        });
    }
    emitNextDecision() {
        if (this.pendingDecisions.length && this.currentSocket && this.currentSocket.connected) {
            this.currentSocket.emit('decision', this.pendingDecisions[0]);
            this.waitingForResponse = true;
        }
    }
    sendLog(logMsg: string) {
        if (this.currentSocket && this.currentSocket.connected) {
            this.currentSocket.emit('log', logMsg);
        }
    }
    async chooseUsername() {
        this.username = await this.makeDecision({
            decision: "chooseUsername",
            id: this.nextDecisionId,
            helperText: Texts.chooseUsername
        });
    }
    notifyPlayerCount() {
        this.currentSocket && this.currentSocket.emit('playerCount', this.game.players.length);
    }
    lm(msg: string, ...params: any[]) {
        const nMsg = msg.replace(/%p/g, this.username);
        this.game.lm(this, nMsg, ...params);
    }
    async chooseCardOrBuy() {
        return await this.makeDecision({
            decision: 'chooseCardOrBuy',
            id: v4(),
            source: this.data.hand,
            gainRestrictions: GainRestrictions.instance().setMaxCoinCost(this.data.money).build(this.game),
            helperText: Texts.chooseCardOrBuy
        });
    }
    async chooseBuy() {
        return await this.makeDecision({
            decision: 'buy',
            id: v4(),
            gainRestrictions: GainRestrictions.instance().setMaxCoinCost(this.data.money).build(this.game),
            helperText: Texts.buy
        });
    }
    async playTurn() {
        this.turnNumber++;
        this.data.buys = 1;
        this.data.money = 0;
        this.data.actions = 1;
        this.lm("%p's turn %s", this.turnNumber);
        this.data.isMyTurn = true;
        await this.actionPhase();
        await this.buyPhase();
        await this.cleanup();
        this.data.isMyTurn = false;
    }
    async cleanup() {
        await this.data.haltNotifications(async () => {
            for (let i = 0; i < this.data.playArea.length; i++) {
                let card = this.data.playArea[i];
                if (card.shouldDiscardFromPlay()) {
                    this.data.playArea.splice(i, 1)[0];
                    await card.onDiscardFromPlay(this   );
                    i--;
                    await this.discard(card);
                }
            }
            const hand = [...this.data.hand];
            this.data.hand = [];
            for (const card of hand) {
                await this.discard(card);
            }
            await this.draw(5);
        });
    }
    async actionPhase() {
        while (this.data.actions > 0 && this.data.hand.filter((a) => a.types.includes('action')).length > 0) {
            const card = await this.chooseCardFromHand(Texts.chooseActionToPlay, true, (card) => card.types.includes("action"));
            if (card) {
                this.data.actions--;
                this.data.playArea.push(card);
                await this.playActionCard(card);
            }
            else {
                break;
            }
        }
    }

    /**
     * This function already expects the given card to be in the playArea
     * (Note that this is not necessarily true, for example, if Feast trashes itself during a Throne Room, this will be called,
     * but the card will be in the trash.
     * @param card
     * @param log
     */
    async playActionCard(card: Card, log = true) {
        if (log) {
            this.lm('%p plays a %s.', card.name);
        }
        let exemptPlayers = [] as Player[];
        if (card.types.includes("attack")) {
            let playersToCheck = this.game.players.filter((a) => a != this);
            for (let player of playersToCheck) {
                if (await player.onAttack(this, card)) {
                    exemptPlayers.push(player);
                }
            }
        }
        await card.onAction(this, exemptPlayers);
    }
    async onAttack(attacker: Player, attackingCard: Card): Promise<boolean> {
        let exempt = false;
        for (let card of this.data.hand) {
            exempt = (await card.onAttackInHand(this, attacker, attackingCard, exempt)) || exempt;
        }
        return exempt;
    }
    async buyPhase() {
        while (this.data.buys > 0 && this.data.hand.filter((a) => a.types.includes('treasure')).length > 0) {
            const choice = await this.chooseCardOrBuy();
            if (choice.choice.name === 'End Turn') return;
            if (choice.responseType === "playCard") {
                const handIndex = this.data.hand.findIndex((a) => a.id === choice.choice.id);
                if (handIndex !== -1) {
                    if (this.data.hand[handIndex].types.indexOf("treasure") === -1) {
                        continue;
                    }
                    const c = this.data.hand.splice(handIndex, 1)[0];
                    this.data.playArea.push(c);
                    this.lm('%p plays a %s.', c.name);
                    this.playTreasure(c);
                    await this.events.emit('treasureCardPlayed', this, c);
                }
            }
            else {
                await this.buy(choice.choice.name);
            }
        }
        while (this.data.buys > 0) {
            const choice = await this.chooseBuy();
            if (choice.choice.name === 'End Turn') return;
            await this.buy(choice.choice.name);
        }
    }
    async buy(cardName: string) {
        this.data.money -= this.game.getCostOfCard(cardName).coin;
        this.data.buys--;
        this.lm('%p buys a %s.', cardName);
        await this.game.emit('buy', this, cardName);
        if (await this.gain(cardName) == null) {
            this.lm('%p fails to gain the %s after on-buy effects.', cardName);
        }
    }
    async gain(cardName: string, realCard?: Card, destination: 'discard' | 'hand' | 'deck' = 'discard'): Promise<Card | null> {
        const c = realCard ? realCard : this.game.grabNameFromSupply(cardName);
        if (c) {
            switch (destination) {
                case 'discard':
                    // Per http://wiki.dominionstrategy.com/index.php/Discard, you do not discard a card when you gain it.
                    await this.deck.discardCard(c);
                    break;
                case 'hand':
                    this.data.hand.push(c);
                    break;
                case 'deck':
                    this.deck.cards.unshift(c);
                    break;
            }
            await this.game.emit('gain', this, c);
            return c;
        }
        return null;
    }
    async playTreasure(card: Card) {
        await card.doTreasure(this);
    }
    async discard(card: Card | Card[]) {
        if (Array.isArray(card)) {
            this.deck.discard.push(...card);
        }
        else {
            this.deck.discard.push(card);
        }
    }
    score() {
        const score: {[cardName: string]: number} = {};
        this.game.selectedCards.forEach((cardName) => {
            score[cardName.split(" ").map((a) => a.slice(0,1).toUpperCase() + a.slice(1)).join(" ")] = CardRegistry.getInstance().getCard(cardName).onScore(this);
        });
        return score;
    }
    async chooseCard(helperText: string, source: Card[], optional = false, filter?: (card: Card) => boolean): Promise<Card | null> {
        const optionalSource: Card[] = optional ? [{name: 'No Card', id: 'nocard'}] as Card[] : [];
        let result;
        let foundCard;
        if ((filter && source.filter(filter).length === 0) || source.length === 0) {
            return null;
        }
        if (((filter && source.filter(filter).length === 1) || source.length === 1) && !optional) {
            return filter ? source.filter(filter)[0] : source[0];
        }
        while((result = await this.makeDecision({
            decision: 'chooseCard',
            source: [...source, ...optionalSource],
            id: v4(),
            helperText
        })) != null && ((foundCard = source.find((a) => a.id === result.id && a.name === result.name)) != null) && (filter && !filter(foundCard))) {

        }
        if (result.name === "No Card") {
            return null;
        }
        return foundCard;
    }
    async chooseCardFromHand(helperText: string, optional = false, filter?: (card: Card) => boolean): Promise<Card | null> {
        const foundCard = await this.chooseCard(helperText, this.data.hand, optional, filter);
        if (foundCard == null) {
            return null;
        }
        const handIndex = this.data.hand.findIndex((a) => a.id === foundCard.id);
        if (handIndex === -1) {
            return null;
        }
        return this.data.hand.splice(handIndex, 1)[0] || null;
    }
    async confirmAction(helperText: string): Promise<boolean> {
        return this.makeDecision({
            decision: 'confirm',
            id: v4(),
            helperText
        });
    }
    async affectOthersInOrder(cb: (player: Player) => Promise<any>) {
        let currentPlayerIndex = this.game.players.indexOf(this);
        let players = this.game.players.slice(currentPlayerIndex + 1, this.game.players.length).concat(this.game.players.slice(0, currentPlayerIndex));
        for (let player of players) {
            await cb(player);
        }
    }
    async attackOthers(exemptPlayers: Player[], cb: (player: Player) => Promise<any>) {
        let currentPlayerIndex = this.game.players.indexOf(this);
        let attacked = this.game.players.slice(currentPlayerIndex + 1, this.game.players.length).concat(this.game.players.slice(0, currentPlayerIndex));
        attacked.filter((a) => !exemptPlayers.includes(a));
        await Promise.all(attacked.map((a) => cb(a)));
    }
    async attackOthersInOrder(exemptPlayers: Player[], cb: (player: Player) => Promise<any>) {
        let currentPlayerIndex = this.game.players.indexOf(this) + 1;
        currentPlayerIndex %= this.game.players.length;
        let currentPlayer: Player;
        while ((currentPlayer = this.game.players[currentPlayerIndex]) != this) {
            if (exemptPlayers.indexOf(currentPlayer) === -1) {
                await cb(currentPlayer);
            }
            currentPlayerIndex++;
            currentPlayerIndex %= this.game.players.length;
        }
    }
    async trash(card: Card) {
        this.lm('%p trashes a %s.', card.name);
        this.game.trash.push(card);
    }
    async chooseOption<T extends ReadonlyArray<string>>(helperText: string, options: T): Promise<T[number]> {
        const {choice} = await this.makeDecision({
            decision: "chooseOption",
            id: v4(),
            options: options as any as string[],
            helperText
        });
        return choice;
    }
    async chooseOrder(helperText: string, cards: Card[], topText: string, bottomText: string): Promise<Card[]> {
        if (cards.length < 2) {
            return cards;
        }
        const {order} = await this.makeDecision({
            decision: 'reorder',
            id: v4(),
            helperText,
            bottomString: bottomText,
            topString: topText,
            cards
        });
        return order.map((a) => cards.find((b) => b.id === a.id)).filter((a) => a) as Card[];
    }
    async chooseGain(helperText: string, optional: boolean, gainRestrictions: GainRestrictions, destination: 'discard' | 'hand' | 'deck' = 'discard'): Promise<Card | null> {
        const cardToGain = await this.makeDecision({
            decision: 'gain',
            helperText,
            id: v4(),
            gainRestrictions: gainRestrictions.build(this.game),
            optional
        });
        if (cardToGain.name === 'Gain Nothing') {
            return null;
        }
        let gained = await this.gain(cardToGain.name, undefined, destination);
        if (gained != null) {
            this.lm('%p gains a %s.', gained.name);
            return gained;
        }
        else {
            return null;
        }
    }
    async chooseCardFromDiscard(helperText: string, optional: boolean, filter?: (card: Card) => boolean): Promise<Card | null> {
        const optionalSource: Card[] = optional ? [{name: 'No Card', id: 'nocard'}] as Card[] : [];
        let result;
        let foundCard;
        if (filter && this.deck.discard.filter(filter).length === 0) {
            // No choices, return
            return null;
        }
        if (this.deck.discard.length === 0) {
            return null;
        }
        let discardNames = this.deck.discard.map((a) => a.name);
        let chooseFrom = this.deck.discard.filter((a, i) => discardNames.indexOf(a.name) === i);
        while ((result = await this.makeDecision({
            decision: 'chooseCard',
            source: [...chooseFrom, ...optionalSource],
            id: v4(),
            helperText
        })) != null && ((foundCard = this.deck.discard.find((a) => a.id === result.id && a.name == result.name)) != null) && (filter && !filter(foundCard))) {
            console.log("Filter unsatisfied");
        }
        if (result.name === "No Card") {
            // Make it very simple to have an out
            return null;
        }
        const discardIndex = this.deck.discard.findIndex((a) => a.id === result.id);
        if (discardIndex !== -1) {
            return this.deck.discard.splice(discardIndex, 1)[0];
        }
        return null;
    }
}