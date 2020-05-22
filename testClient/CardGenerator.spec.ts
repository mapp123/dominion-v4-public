import {Builder, By, logging, until, WebDriver} from 'selenium-webdriver';
import {ChildProcess, fork} from "child_process";
import CardRegistry from "../src/cards/CardRegistry";
import ClientInstrumentor from "./ClientInstrumentor";
const logReg = /http:\/\/localhost:\d*(?:\/.*?)*\s\d+:\d+\s"(.*)"/;
describe('CardGenerator', () => {
    let process: ChildProcess;
    let driver: WebDriver;
    before((done) => {
        process = fork('./src/server/app.js', [], {
            env: {
                PORT: "4000"
            },
            silent: true
        });
        let data = "";
        process.stdout?.on('data', (d) => {
            data += d;
            if (data.startsWith("Listening")) {
                new Builder().forBrowser('chrome').build().then((d) => {
                    driver = d;
                    done();
                });
            }
        });
    });
    const c = new ClientInstrumentor();
    afterEach(async () => {
        await c.addCoverage(driver);
    });
    after(async () => {
        c.complete();
        await driver.close();
        process.kill();
    });
    const cardLocations = CardRegistry.getInstance().allCardLocations();
    Object.values(cardLocations).forEach((card) => {
        it(`renders ${card}`, async function() {
            driver.navigate().to(`http://localhost:4000/previewCard/${card}`);
            const detected = await driver.executeAsyncScript<boolean>(function(callback) {
                if (typeof window.addEventListener === 'function') {
                    // @ts-ignore
                    let typelineResolved = window.renderLandscape || window.typelineResolved;
                    // @ts-ignore
                    let descriptionResolved = window.descriptionResolved;
                    // @ts-ignore
                    let topResolved = window.topResolved;
                    if (typelineResolved && descriptionResolved && topResolved) {
                        callback(true);
                        return;
                    }
                    window.addEventListener('typelineResolved', (e) => {
                        typelineResolved = true;
                        if (descriptionResolved && topResolved) {
                            callback(true);
                        }
                    });
                    window.addEventListener('descriptionResolved', (e) => {
                        descriptionResolved = true;
                        if (typelineResolved && topResolved) {
                            callback(true);
                        }
                    });
                    window.addEventListener('topResolved', (e) => {
                        topResolved = true;
                        if (typelineResolved && descriptionResolved) {
                            callback(true);
                        }
                    });
                }
                else {
                    callback(false);
                }
            });
            if (!detected) {
                await new Promise((f) => setTimeout(f, 500));
            }
            const logs = await driver.manage().logs().get(logging.Type.BROWSER);
            for (const log of logs) {
                console.log('[%s] %s', log.level.name, log.message);
                const [, message] = logReg.exec(log.message) || [null, null];
                if (log.level.name === "SEVERE") {
                    switch (message) {
                        case "Missing card art":
                            throw new Error(`Card ${card} has missing artwork`);
                        default:
                            throw new Error(log.message);
                    }
                }
            }
        });
    });
});