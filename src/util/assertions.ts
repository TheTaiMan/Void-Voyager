export default function assert(val: any, message: string): asserts val {
    if (!val) {
        throw new AssertionError(message);
    }
}

// Custom error class for assertion failures
class AssertionError extends Error {
    constructor(message: string) {
        super(message);
    }
}
