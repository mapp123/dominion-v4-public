export default class Cost {
    private readonly _coin: number;
    private readonly _potion: number;
    private readonly _debt: number;
    get coin() {
        return this._coin;
    }
    get potion() {
        return this._potion;
    }
    get debt() {
        return this._debt;
    }
    static create(coin: number, potion = 0, debt = 0) {
        return new this(coin, potion, debt);
    }
    augmentBy(other: Cost) {
        return new Cost(this._coin + other._coin, this._potion + other._potion, this._debt + other._debt);
    }
    augmentByMany(others: Cost[]) {
        return new Cost(
            this._coin + others.reduce((sum, next) => sum + next._coin, 0),
            this._potion + others.reduce((sum, next) => sum + next._potion, 0),
            this._debt + others.reduce((sum, next) => sum + next._debt, 0)
        );
    }
    private constructor(coin: number, potion: number, debt: number) {
        this._coin = Math.max(0, coin);
        this._potion = Math.max(0, potion);
        this._debt = Math.max(0, debt);
    }
    toJSON() {
        return Object.fromEntries(Object.entries({
            coin: this._coin,
            potion: this._potion,
            debt: this._debt
        }).filter(([key, value]) => key === 'coin' || value !== 0));
    }
    static fromJSON(json: {coin: number; potion?: number; debt?: number}) {
        return new Cost(json.coin, json.potion || 0, json.debt || 0);
    }
}