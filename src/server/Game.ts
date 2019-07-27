import {Namespace, Server, Socket} from "socket.io";
import {v4} from "uuid";
import {struct} from 'superstruct';
import Player from "./Player";
import Rules from "./Rules";
import shuffle from "./util/shuffle";
import {format} from "util";
import Supply from "./Supply";
import CardRegistry from "../cards/CardRegistry";
import Card from "../cards/Card";
interface Events {
    buy: [Player, string];
    gain: [Player, Card];
    turnStart: [Player];
}
type Listener<T extends keyof Events> = (...args: Events[T]) => Promise<boolean> | boolean;
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
    lastPlayer: Player | null = null;
    repeatLastPlayer = false;
    currentPlayerIndex = 0;
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
    }
    private cardsValidator = struct.list(['string']);
    setCards(socket: Socket, ...args: any[]) {
        this.selectedCards = this.cardsValidator(args[0]);
        this.selectedCards = Rules.chooseBasicCards(this.selectedCards);
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
    // This method could currently be static, but with cost modifiers in the future it can't be.
    // noinspection JSMethodCanBeStatic
    getCostOfCard(card: string) {
        return CardRegistry.getInstance().getCard(card).cost;
    }
    lmg(msg: string, ...params: any[]) {
        this.lm(null, msg,...params);
    }
    lm(subject: Player | null, msg: string, ...params: any[]) {
        msg = msg.split("%c").join('%h[card]');
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
        this.gameLoop();
    }
    gameEnded() {
        return this.supply.getPile('province')!.length === 0 || this.supply.pilesEmpty >= (this.players.length < 5 ? 3 : 4);
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
            await this.players[this.currentPlayerIndex].playTurn();
            this.runAccountability();
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        }
        this.endOfGame();
    }
    determineTurnOrder() {
        shuffle(this.players);
    }
    endOfGame() {
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
                if (score > 0) {
                    this.lmg('-> %s: %s', name, score);
                }
            });
        });
        scores.forEach(([player, , total]) => {
            this.lmg('%s scored %s points.', player.username, total);
        });
        this.lmg('%s wins!', scores[0][0].username);
    }
    private listeners: {[T in keyof Events]: Array<Listener<T>>} = {
        buy: [],
        gain: [],
        turnStart: []
    };
    async emit<T extends keyof Events>(eventName: T, ...args: Events[T]) {
        const l: Array<Listener<T>> = this.listeners[eventName] as any;
        const rem: number[] = [];
        for (let i = 0; i < l.length; i++) {
            if (!await l[i](...args)) {
                rem.push(i);
            }
        }
        this.listeners[eventName] = l.filter((a, i) => !rem.includes(i)) as any;
    }
    on<T extends keyof Events>(eventName: T, listener: Listener<T>) {
        this.listeners[eventName].push(listener as any);
        return listener;
    }
    off<T extends keyof Events>(eventName: T, listener: Listener<T>) {
        if (this.listeners[eventName].includes(listener as any)) {
            this.listeners[eventName].splice(this.listeners[eventName].indexOf(listener as any), 1);
        }
    }

    nameAvailableInSupply(cardName: string) {
        return this.supply.data.piles.find((a) => a.pile.length > 0 && a.pile[a.pile.length - 1].name === cardName) != null;
    }

    grabNameFromSupply(cardName: string) {
        const pile = this.supply.data.piles.find((a) => a.pile.length > 0 && a.pile[a.pile.length - 1].name === cardName);
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
    grabCard(cardId: string, hint?: 'supply' | 'activeHand', hintMandatory = false): Card | null {
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
        if (hintMandatory) {
            return null;
        }
        let card = this.tryActiveHand(cardId, true);
        if (card) return card;
        card = this.trySupply(cardId, true);
        if (card) return card;
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
    runAccountability() {
        const newIds = [
            ...this.supply.data.piles.reduce((arr, pile) => [...arr, ...pile.pile.map((card) => card.id)], [] as string[]),
            ...this.players.reduce((arr, player) => [...arr, ...player.allCards.map((a) => a.id)], [] as string[]),
            ...this.trash.map((a) => a.id)
        ];
        const missing = this.cardIds.filter((a) => !newIds.includes(a));
        const extra = [...newIds.filter((a) => !this.cardIds.includes(a)), ...newIds.filter((a, i) => newIds.indexOf(a) !== i)];
        if (missing.length || extra.length) {
            this.onAccountabilityFailure(missing, extra);
        }
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