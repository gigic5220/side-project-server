export class CreateNotificationDto {
    userId: number;
    message: string;
    type: string;
    parameterId: number;
    parameterText: string;
}