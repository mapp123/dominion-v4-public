export class Interrupt {
    data: any;
    type: string;

    constructor(type: string, data: any) {
        this.type = type;
        this.data = data;
    }
}