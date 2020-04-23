import {Collector} from 'istanbul';
import type {WebDriver} from "selenium-webdriver";
export default class ClientInstrumentor {
    private collector = new Collector();
    private _complete = false;
    async addCoverage(driver: WebDriver) {
        if (this._complete) {
            throw new Error("Cannot collect coverage on a completed collector");
        }
        const coverage = await driver.executeAsyncScript(function(callback) {
            // @ts-ignore
            callback(window.__coverage__);
        });
        if (coverage == null) {
            // We're not collecting coverage
            return;
        }
        this.collector.add(coverage);
    }
    complete() {
        this._complete = true;
        // @ts-ignore
        if (typeof globalThis.__coverage__ === 'undefined') {
            // We're not collecting coverage, so don't actually do anything
            return;
        }
        // @ts-ignore
        this.collector.add(__coverage__);
        // @ts-ignore
        __coverage__ = this.collector.getFinalCoverage();
    }
}