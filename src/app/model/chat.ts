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



export class ChattingList {
    constructor(
        public name: string,
        public latestMessage: any,
        public status: string,
        public unreadMessage: string,
        public email: string
    ) {

    }
}
