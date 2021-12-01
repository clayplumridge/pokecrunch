import { strict as assert } from "assert";
import { exec as execEggGroupPath } from "./exec/eggGroupPath";

function run(): string {
    // Setup
    const args = process.argv.slice(2);
    const mode = args.shift();

    // Utility function for asserting that there are the right number of args for the given mode
    function assertArgLength(length: number) {
        assert.equal(
            length,
            args.length,
            `Wrong number of args for mode ${mode} - expected ${length} but got ${args.length}`
        );
    }

    // Switch on our actual mode
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
