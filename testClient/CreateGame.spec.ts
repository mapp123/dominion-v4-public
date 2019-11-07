import {Builder, By, until, WebDriver} from 'selenium-webdriver';
import {ChildProcess, fork} from "child_process";
import { expect } from 'chai';
import ClientInstrumentor from "./ClientInstrumentor";
describe('CreateGame', () => {
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
    after(async () => {
        c.complete();
        await driver.close();
        process.kill();
    });
    afterEach(async () => {
        await c.addCoverage(driver);
    });
    step('it creates a game', async () => {
        await driver.navigate().to(`http://localhost:4000`);
        await driver.wait(until.elementLocated(By.xpath('//button')));
        await driver.findElement(By.xpath('//button')).click();
        await driver.wait(until.elementLocated(By.xpath('//label[text()="Card 10"]')))
    });
    step('it creates a game with a name', async () => {
        const getByLabel = (label: string) => driver.findElement(By.xpath(`//label[text()="${label}"]/following-sibling::input`));
        await Promise.all([
            getByLabel('Shortcut').sendKeys('Test Game'),
            getByLabel('Card 1').sendKeys('cellar'),
            getByLabel('Card 2').sendKeys('chapel'),
            getByLabel('Card 3').sendKeys('council room'),
            getByLabel('Card 4').sendKeys('feast'),
            getByLabel('Card 5').sendKeys('festival'),
            getByLabel('Card 6').sendKeys('laboratory'),
            getByLabel('Card 7').sendKeys('market'),
            getByLabel('Card 8').sendKeys('militia'),
            getByLabel('Card 9').sendKeys('mine'),
            getByLabel('Card 10').sendKeys('moat'),
        ]);
        await driver.findElement(By.xpath('//button[text()="Create Game"]')).click();
        await driver.wait(until.elementLocated(By.xpath('//span[@class="dominion-font-small"]')));
    });
    step('the game appears on the front page', async () => {
        const gameURL = await driver.getCurrentUrl();
        await driver.navigate().to(`http://localhost:4000`);
        const linkPath = '//a[text()="Test Game"]';
        await driver.wait(until.elementLocated(By.xpath(linkPath)));
        await driver.findElement(By.xpath(linkPath)).click();
        expect(gameURL).to.equal(await driver.getCurrentUrl());
    });
    step('the game has all the selected cards', async () => {
        const waitForNamedButton = (cardName: string) => driver.wait(until.elementLocated(By.xpath(`//button[text()="${cardName}"]`)));
        const startButton = '//button[text()="Start Game"]';
        await driver.wait(until.elementLocated(By.xpath(startButton)));
        await driver.findElement(By.xpath(startButton)).click();
        await Promise.all([
            waitForNamedButton('cellar'),
            waitForNamedButton('chapel'),
            waitForNamedButton('council room'),
            waitForNamedButton('feast'),
            waitForNamedButton('festival'),
            waitForNamedButton('laboratory'),
            waitForNamedButton('market'),
            waitForNamedButton('militia'),
            waitForNamedButton('mine'),
            waitForNamedButton('moat')
        ]);
    });
});