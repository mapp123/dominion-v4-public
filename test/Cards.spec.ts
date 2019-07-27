import {readdirSync} from "fs";
import {resolve} from "path";

describe('CARDS', () => {
    const dir = readdirSync(__dirname, {
        withFileTypes: true
    });
    dir.filter((a) => a.isDirectory()).forEach((box) => {
        describe(box.name.toUpperCase(), () => {
            const cards = readdirSync(resolve(__dirname, box.name));
            cards.filter((a) => /.*\.spec\.ts$/.test(a)).forEach((card) => {
                process.env.NODE_ENV = '';
                process.env.SHOULD_LOG_PRIVATE = 'yes';
                require(resolve(__dirname, box.name, card));
            });
        });
    });
});