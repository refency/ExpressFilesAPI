export default class userDTO {
    email;
    id;

    constructor(User) {
        this.email = User.email;
        this.id = User.id;
    }
}
