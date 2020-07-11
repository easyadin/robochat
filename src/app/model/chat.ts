export class Chat {
    constructor(
        public messages: string,
        public timestamp: any,
        public participantID: any,
    ) {

    }
}


export class Contact {
    constructor(
        public email: string,
        public name: any,
    ) {

    }
}
