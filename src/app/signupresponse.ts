export class Signupresponse {
    statusMessage: string = "";
    apiKey: string ="";
    userId: string= "";
    status: string ="";
    jwtToken: string ="";

    constructor (statusMessage:string, apiKey:string, userId:string){
        this.statusMessage=statusMessage;
        this.apiKey=apiKey;
        this.userId=userId;
    }

    public setsStatusAndToken(status:string,jwtToken:string){
        this.status = status;
        this.jwtToken = jwtToken;
    }
}
