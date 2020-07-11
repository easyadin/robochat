export class Chat {
    constructor(
        public message: string,
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
