export class Chatsession {
    constructor(
        public connectionMergeUID: string,
        public participants: Array<string> = [],
        public content: Array<Object> = [],
    ) {

    }
}
