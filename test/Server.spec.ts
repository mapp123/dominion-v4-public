import {readdirSync} from "fs";
import {resolve} from "path";

const tests = readdirSync(resolve(__dirname, "server"));
tests.forEach((test) => {
    if (!test.endsWith(".spec.js")) {
        return;
    }
    require(resolve(__dirname, "server", test));
});