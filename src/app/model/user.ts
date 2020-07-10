export class User {
    constructor(
        public fullname: string,
        public phone: string,
        public email: string,
        public password: string,
        public location: any,
        public status: string,
    ) { }
}

export class currentUser {
    constructor(
        public fullname: string,
        public phone: string,
        public email: string,
        public location: any,
        public status: string,
    ) { }
}