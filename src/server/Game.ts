import {Namespace, Server, Socket} from "socket.io";
import {v4} from "uuid";
import {struct} from 'superstruct';
import Player from "./Player";
import Rules from "./Rules";
import shuffle from "./util/shuffle";
import {format} from "util";
import Supply from "./Supply";
import CardRegistry from "../cards/CardRegistry";
import Card, {Cost, ValidCardTypes} from "../cards/Card";
import {GameEvents} from "./Events";
import {GainRestrictions} from "./GainRestrictions";
import Artifact from "../cards/Artifact";
import BigMoney from "./BigMoney";
import CardHolder from "./CardHolder";
export default class Game {
    players: Player[] = [];
    io: Namespace;
    id: string = v4();
    name?: string;
    host?: Player;
    started = false;
    trash: Card[] = [];
    supply = new Supply();
    selectedCards: string[] = [];
    ended = false;
    events = new GameEvents();
    currentPlayerIndex = 0;
    aiNumber = 1;
    constructor(io: Server) {
        this.io = io.of('/' + this.id);
        this.io.on('connection', this.onConnect.bind(this));
    }
    private registerEvent(socket: Socket, event: string, handler: (socket: Socket, ...args: any[]) => any) {
        socket.on(event, (...args: any[]) => {
            try {
                handler.call(this, socket, ...args);
            }
            catch (e) {
                console.error(e);
                socket.emit('invalidMsg', event, ...args);
            }
        });
    }
    onConnect(socket: Socket) {
        this.registerEvent(socket, 'setCards', this.setCards);
        this.registerEvent(socket, 'joinAsNewPlayer', this.registerAsPlayer);
        this.registerEvent(socket, 'joinAsPlayer', this.joinAsPlayer);
        this.registerEvent(socket, 'setAIPlayers', this.setAIPlayers);
    }
    private aiPlayersValidator = struct.scalar('number');
    setAIPlayers(socket: Socket, ...args: any[]) {
        const aiPlayers = this.aiPlayersValidator(args[0]);
        for (let i = 0; i < aiPlayers; i++) {
            this.players.push(new BigMoney(this));
        }
    }
    private cardsValidator = struct.list(['string']);
    randomizedCards: string[] | undefined;
    setCards(socket: Socket, ...args: any[]) {
        this.selectedCards = this.cardsValidator(args[0]);
        this.randomizedCards = this.selectedCards.slice(0);
        this.selectedCards = Rules.chooseBasicCards(this.selectedCards);
        this.selectedCards = [...this.selectedCards, ...Rules.getStartingCards(this.randomizedCards).map((a) => a.cardName)].filter((a, i, arr) => arr.indexOf(a) === i);
        for (let i = 0; i < this.selectedCards.length; i++) {
            let extras = CardRegistry.getInstance().getCard(this.selectedCards[i]).onChosen();
            extras.forEach((extra) => {
                if (!this.selectedCards.includes(extra)) {
                    this.selectedCards.push(extra);
                }
            });
        }
        for (let i = 0; i < this.selectedCards.length; i++) {
            let extras = CardRegistry.getInstance().getCard(this.selectedCards[i]).registerOtherCards();
            extras.forEach((extra) => {
                if (!this.selectedCards.includes(extra)) {
                    this.selectedCards.push(extra);
                }
            });
        }
        this.checkForCostModifier = [...this.selectedCards];
        this.checkForTypeModifier = [...this.selectedCards];
        this.checkForRestrictionModifier = [...this.selectedCards];
    }
    giveArtifactTo(artifact: string, player: Player) {
        return (CardRegistry.getInstance().getCard(artifact) as any as typeof Artifact).giveTo(player);
    }
    getArtifact(card: string): Artifact {
        return (CardRegistry.getInstance().getCard(card) as any as typeof Artifact).getI(this);
    }
    private registerValidator = struct.scalar('string');
    registerAsPlayer(socket: Socket, ...args: any[]) {
        const returnTo = this.registerValidator(args[0]);
        const player = new Player(this);
        this.players.push(player);
        player.currentSocket = socket;
        if (!this.host) {
            this.host = player;
        }
        this.host.notifyPlayerCount();
        socket.emit(returnTo, player.id);
    }
    private joinValidator = struct.tuple(['string', 'string'] as const);
    joinAsPlayer(socket: Socket, ...args: any[]) {
        const [playerId, returnTo] = this.joinValidator(args);
        const player = this.players.find((a) => a.id === playerId);
        if (!player) {
            return;
        }
        player.currentSocket = socket;
        if (this.host) {
            this.host.notifyPlayerCount();
        }
        socket.emit(returnTo, player.id);
    }
    getCard(card: string) {
        return CardRegistry.getInstance().getCard(card);
    }
    private checkForRestrictionModifier: string[] = [];
    addAdditionalBuyRestrictions(player: Player, restrictions: GainRestrictions): GainRestrictions {
        this.checkForRestrictionModifier = this.checkForRestrictionModifier.filter((card) => {
            try {
                restrictions = CardRegistry.getInstance().getCard(card).getExtraRestrictions(this.supply.data.globalCardData[card], player, restrictions);
                return true;
            }
            catch (e) {
                return false;
            }
        });
        return restrictions;
    }
    private checkForTypeModifier: string[] = [];
    updateTypeModifiers() {
        const mods: {[card: string]: {toRemove: ValidCardTypes[]; toAdd: ValidCardTypes[]}} = {};
        this.checkForTypeModifier = this.checkForTypeModifier.filter((a) => {
            const modifiers = CardRegistry.getInstance().getCard(a).getTypeModifier(this.supply.data.globalCardData[a], this, this.selectedCards);
            if (modifiers) {
                Object.keys(modifiers).forEach((card) => {
                    if (mods[card]) {
                        const localModifier = modifiers[card];
                        mods[card].toRemove = [...mods[card].toRemove, ...localModifier[card].toRemove];
                        mods[card].toAdd = [...mods[card].toAdd, ...localModifier[card].toAdd];
                    }
                    else {
                        mods[card] = modifiers[card];
                    }
                });
                return true;
            }
            return false;
        });
        this.supply.data.typeModifiers = mods;
    }
    private checkForCostModifier: string[] = [];
    updateCostModifiers() {
        const mods = {};
        this.checkForCostModifier = this.checkForCostModifier.filter((a) => {
            const modifiers = CardRegistry.getInstance().getCard(a).getCostModifier(this.supply.data.globalCardData[a], this, this.selectedCards);
            if (modifiers) {
                Object.keys(modifiers).forEach((card) => {
                    if (mods[card]) {
                        const localModifier = modifiers[card];
                        Object.keys(localModifier).forEach((mod) => {
                            mods[card][mod] += localModifier[mod];
                        });
                    }
                    else {
                        mods[card] = modifiers[card];
                    }
                });
                return true;
            }
            return false;
        });
        this.supply.data.costModifiers = mods;
    }
    getCostOfCard(card: string): Cost {
        if (CardRegistry.getInstance().getCard(card) == null) {
            return {
                coin: 0
            };
        }
        const cost = {...CardRegistry.getInstance().getCard(card).cost};
        Object.entries(this.supply.data.costModifiers[card] || {}).forEach(([key, value]) => {
            cost[key] += value;
        });
        Object.entries(cost).forEach(([key, value]) => {
            cost[key] = Math.max(0, value);
        });
        return cost;
    }
    getTypesOfCard(card: string): readonly ValidCardTypes[] {
        const types = CardRegistry.getInstance().getCard(card).types;
        if (this.supply.data.typeModifiers[card]) {
            return types.filter((a) => !this.supply.data.typeModifiers[card].toRemove.includes(a)).concat(this.supply.data.typeModifiers[card].toAdd);
        }
        return types;
    }
    lmg(msg: string, ...params: any[]) {
        this.lm(null, msg,...params);
    }
    lm(subject: Player | null, msg: string, ...params: any[]) {
        msg = msg.split("%c").join('%h[card]');
        msg = msg.split("%ac").join("%h[a card]");
        const unformattedPrivateMsg = msg.replace(/%h\[.*?]/g, '%s');
        // Count the number of private arguments
        const argsCount = unformattedPrivateMsg.split("%").length - (unformattedPrivateMsg.split("%%").length * 2);
        // Pass exactly that number of arguments, anything extra just gets tacked on.
        const privateMsg = format(unformattedPrivateMsg, ...params.slice(0, argsCount + 1));
        // Build the message that will be sent everywhere else
        const unformattedPublicMsg = msg.replace(/%h/g, '%i');
        const publicMsg = format(unformattedPublicMsg, ...params.slice(0, argsCount + 1))
            .replace(/NaN\[(.*)]/g, (match, replacement) => replacement);
        // TODO: Grammar correction
        this.players.forEach((p) => {
            if (p === subject) {
                p.sendLog(privateMsg);
            }
            else {
                p.sendLog(publicMsg);
            }
        });
        if (process.env.SHOULD_LOG_PRIVATE === 'yes') {
            this.io.emit('log', privateMsg);
        }
    }
    async forAllPlayers(cb: (player: Player) => Promise<any>) {
        for (let i = 0; i < this.players.length; i++) {
            await cb(this.players[i]);
        }
    }
    start() {
        this.started = true;
        return this.gameLoop();
    }
    gameEnded() {
        return this.supply.getPile('province')!.length === 0 || this.supply.pilesEmpty >= (this.players.length < 5 ? 3 : 4) || (this.supply.getPile('colony') && this.supply.getPile('colony')!.length === 0);
    }
    async gameLoop() {
        this.supply.setup(this.selectedCards, this.players.length, this);
        this.setupAccountability();
        await this.forAllPlayers(async (player) => {
            player.data.gameStarted = true;
            await player.chooseUsername();
        });
        this.determineTurnOrder();
        this.lmg('Play order has been determined: %s.',
            this.players.length === 1 ?
                this.players[0].username :
                this.players.slice(0, -1).map((p) => p.username).join(", ") + " and " + this.players.slice(-1)[0].username);
        while (!this.gameEnded()) {
            await this.events.emit('turnStart', this.players[this.currentPlayerIndex]);
            await this.players[this.currentPlayerIndex].playTurn();
            await this.events.emit('turnEnd', this.players[this.currentPlayerIndex]);
            this.runAccountability();
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        }
        await this.endOfGame();
    }
    determineTurnOrder() {
        shuffle(this.players);
    }
    async endOfGame() {
        await this.events.emit('scoreStart');
        const scores = this.players.map((player) => {
            let score = player.score();
            let scoreNumber = Object.values(score).reduce((sum, value) => sum + value, 0);
            return [player, player.score(), scoreNumber] as [Player, {[key: string]: number}, number];
        }).sort((a, b) => {
            return a[2] - b[2];
        });
        scores.forEach(([player, scoreTable]) => {
            this.lmg('%s: Score Breakdown:', player.username);
            Object.entries(scoreTable).forEach(([name, score]) => {
                if (score !== 0) {
                    this.lmg('-> %s: %s', name, score);
                }
            });
        });
        scores.forEach(([player, , total]) => {
            this.lmg('%s scored %s points.', player.username, total);
        });
        this.lmg('%s wins!', scores[scores.length - 1][0].username);
        this.ended = true;
        await this.events.emit('gameEnd');
    }

    nameAvailableInSupply(cardName: string) {
        return this.supply.data.piles.find((a) => a.pile.length > 0 && a.pile[a.pile.length - 1].name === cardName) != null;
    }

    grabNameFromSupply(cardName: string) {
        const pile = this.supply.data.piles.find((a) => a.pile.length > 0 && (a.pile[a.pile.length - 1].name === cardName || a.identifier === cardName));
        if (pile) {
            return pile.pile.splice(pile.pile.length - 1, 1)[0];
        }
        return null;
    }

    /**
     * Find a card, removes it from it's current location, and returns the instance
     * @param cardId
     * @param hint
     * @param hintMandatory - Should other places be checked after the hint?
     */
    grabCard(cardId: string, hint?: 'supply' | 'activeHand' | 'trash', hintMandatory = false): Card | null {
        if (hint === 'supply') {
            const card = this.trySupply(cardId, true);
            if (card) {
                return card;
            }
        }
        else if (hint === 'activeHand') {
            const card = this.tryActiveHand(cardId, true);
            if (card) {
                return card;
            }
        }
        else if (hint === 'trash') {
            const card = this.tryTrash(cardId, true);
            if (card) {
                return card;
            }
        }
        if (hintMandatory) {
            return null;
        }
        let card = this.tryActiveHand(cardId, true);
        if (card) return card;
        card = this.trySupply(cardId, true);
        if (card) return card;
        return null;
    }
    findCard(cardId: string, hint?: 'supply' | 'activeHand' | 'trash', hintMandatory = false): Card | null {
        if (hint === 'supply') {
            const card = this.trySupply(cardId, false);
            if (card) {
                return card;
            }
        }
        else if (hint === 'trash') {
            const card = this.tryTrash(cardId, false);
            if (card) {
                return card;
            }
        }
        else if (hint === 'activeHand') {
            const card = this.tryActiveHand(cardId, false);
            if (card) {
                return card;
            }
        }
        if (hintMandatory) {
            return null;
        }
        let card = this.trySupply(cardId, false);
        if (card) return card;
        card = this.tryTrash(cardId, false);
        if (card) return card;
        card = this.tryActiveHand(cardId, false);
        if (card) return card;
        return null;
    }
    private tryTrash(cardId: string, remove: boolean) {
        const trashIndex = this.trash.findIndex((a) => a.id === cardId);
        if (trashIndex > -1 && remove) {
            return this.trash.splice(trashIndex, 1)[0];
        }
        else if (trashIndex > -1) {
            return this.trash[trashIndex];
        }
        return null;
    }
    private tryActiveHand(cardId: string, remove: boolean) {
        const handIndex = this.players[this.currentPlayerIndex].data.hand.findIndex((a) => a.id === cardId);
        if (handIndex > -1 && remove) {
            return this.players[this.currentPlayerIndex].data.hand.splice(handIndex, 1)[0];
        }
        else if (handIndex > -1) {
            return this.players[this.currentPlayerIndex].data.hand[handIndex];
        }
        return null;
    }
    private trySupply(cardId: string, remove: boolean) {
        const pile = this.supply.data.piles.find((a) => a.pile.find((b) => b.id === cardId) != null);
        if (pile != null && remove) {
            return pile.pile.splice(pile.pile.findIndex((a) => a.id === cardId), 1)[0];
        }
        else if (pile != null) {
            return pile.pile[pile.pile.findIndex((a) => a.id === cardId)];
        }
        return null;
    }
    private cardIds: string[] = [];
    setupAccountability() {
        this.cardIds = [...this.cardIds, ...this.supply.data.piles.reduce((arr, pile) => [...arr, ...pile.pile.map((card) => card.id)], [] as string[])];
        this.cardIds = [...this.cardIds, ...this.players.reduce((arr, player) => [...arr, ...player.allCards.map((a) => a.id)], [] as string[])];
    }
    private accountabilityHelpers: CardHolder[] = [];
    runAccountability() {
        const newIds = [
            ...this.supply.data.piles.reduce((arr, pile) => [...arr, ...pile.pile.map((card) => card.id)], [] as string[]),
            ...this.players.reduce((arr, player) => [...arr, ...player.allCards.map((a) => a.id)], [] as string[]),
            ...this.trash.map((a) => a.id),
            ...this.accountabilityHelpers.reduce((cards, helper) => [...cards, ...helper.getCards()], [] as Card[]).map((a) => a.id)
        ];
        const missing = this.cardIds.filter((a) => !newIds.includes(a));
        const extra = [...newIds.filter((a) => !this.cardIds.includes(a)), ...newIds.filter((a, i) => newIds.indexOf(a) !== i)];
        if (missing.length || extra.length) {
            this.onAccountabilityFailure(missing, extra);
        }
    }
    getCardHolder() {
        const ch = new CardHolder();
        this.accountabilityHelpers.push(ch);
        return ch;
    }
    onAccountabilityFailure(missingIds: string[], extraIds: string[]) {
        if (missingIds.length) {
            console.error("The following cards went missing: " + missingIds.join(", "));
        }
        if (extraIds.length) {
            console.error("The following cards were created or duplicated: " + extraIds.join(", "));
        }
    }
}