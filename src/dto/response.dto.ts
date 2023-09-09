export class ResponseDto<T> {
    data: T;
    isSuccess: boolean;
    status: number;
    message: string;

    constructor(data: T, isSuccess: boolean, status: number, message: string) {
        this.data = data;
        this.isSuccess = isSuccess;
        this.status = status;
        this.message = message;
    }
}