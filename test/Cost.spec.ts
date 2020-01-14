import {expect} from 'chai';
import Cost, {CostResult} from "../src/server/Cost";
describe('COST', () => {
    it('compares costs without potions and potions correctly', () => {
        expect(Cost.create(1).compareTo(Cost.create(1, 1))).to.equal(CostResult.LESS_THAN);
        expect(Cost.create(1, 1).compareTo(Cost.create(1))).to.equal(CostResult.GREATER_THAN);
        expect(Cost.create(1, 2).compareTo(Cost.create(2, 1))).to.equal(CostResult.INCOMPARABLE);
    });
    it('compares costs without debt and debt correctly', () => {
        expect(Cost.create(1).compareTo(Cost.create(1, 0, 1))).to.equal(CostResult.LESS_THAN);
        expect(Cost.create(1, 0, 1).compareTo(Cost.create(1))).to.equal(CostResult.GREATER_THAN);
        expect(Cost.create(1, 0, 2).compareTo(Cost.create(2, 0,1))).to.equal(CostResult.INCOMPARABLE);
    });
    it('compares all three correctly', () => {
        expect(Cost.create(1).compareTo(Cost.create(1, 1, 1))).to.equal(CostResult.LESS_THAN);
        expect(Cost.create(1, 1, 1).compareTo(Cost.create(1))).to.equal(CostResult.GREATER_THAN);
        expect(Cost.create(1, 1, 2).compareTo(Cost.create(2, 4,1))).to.equal(CostResult.INCOMPARABLE);
    });
});