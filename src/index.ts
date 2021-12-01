import { strict as assert } from "assert";
import { exec as execEggGroupPath } from "./exec/eggGroupPath";

function run(): string {
    const args = process.argv.slice(2);
    const mode = args.shift();

    function assertArgLength(length: number) {
        assert.equal(
            length,
            args.length,
            `Wrong number of args for mode ${mode} - expected ${length} but got ${args.length}`
        );
    }

    switch (mode) {
        case "egg-path":
            assertArgLength(2);
            return execEggGroupPath(args[0], args[1]);
        default:
            return `Unable to find mode matching ${mode}`;
    }
}

const output = run();
console.log(output);
