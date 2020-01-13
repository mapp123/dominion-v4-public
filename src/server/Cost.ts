export const enum CostResult {
    LESS_THAN,
    EQUAL,
    GREATER_THAN,
    INCOMPARABLE
}
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
    compareTo(other: Cost): CostResult {
        const check = ['coin', 'potion', 'debt'];
        let result = CostResult.EQUAL;
        for (const toCheck of check) {
            if (this[toCheck] === other[toCheck]) {
                continue;
            }
            if (this[toCheck] > other[toCheck]) {
                if (result === CostResult.LESS_THAN) {
                    result = CostResult.INCOMPARABLE;
                    break;
                }
                result = CostResult.GREATER_THAN;
            }
            if (this[toCheck] < other[toCheck]) {
                if (result === CostResult.GREATER_THAN) {
                    result = CostResult.INCOMPARABLE;
                    break;
                }
                result = CostResult.LESS_THAN;
            }
        }
        return result;
    }
    isInRange(lowerInclusive: Cost | null, upperInclusive: Cost | null): boolean {
        if (lowerInclusive != null) {
            const lowerResult = this.compareTo(lowerInclusive);
            if (lowerResult === CostResult.INCOMPARABLE || lowerResult === CostResult.LESS_THAN) {
                return false;
            }
        }
        if (upperInclusive != null) {
            const upperResult = this.compareTo(upperInclusive);
            if (upperResult === CostResult.INCOMPARABLE || upperResult === CostResult.GREATER_THAN) {
                return false;
            }
        }
        return true;
    }
    augmentBy(other: Cost | null) {
        if (other == null) return this;
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
        this._coin = coin;
        this._potion = potion;
        this._debt = debt;
    }
    normalize() {
        return new Cost(Math.max(0, this.coin), Math.max(0, this.potion), Math.max(0, this.debt));
    }
    toJSON() {
        return Object.fromEntries(Object.entries({
            coin: this._coin,
            potion: this._potion,
            debt: this._debt,
            _rehydrateWith: 'cost'
        }).filter(([key, value]) => key === 'coin' || value !== 0));
    }
    static fromJSON(json: {coin: number; potion?: number; debt?: number}) {
        return new Cost(json.coin, json.potion || 0, json.debt || 0);
    }
}