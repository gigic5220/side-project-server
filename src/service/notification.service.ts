import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, UpdateResult} from 'typeorm';
import {Notification} from "../entity/notification.entity";
import {CreateNotificationDto} from "../dto/createNotification.dto";
import {UpdateNotificationDto} from "../dto/updateNotification.dto";

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>
    ) {}

    async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
        return await this.notificationRepository.save(createNotificationDto);
    }

    async update(id: number, updateNotificationDto: UpdateNotificationDto): Promise<UpdateResult> {
        return await this.notificationRepository.update(id, updateNotificationDto);
    }

    async softDelete(id: number): Promise<void> {
        await this.notificationRepository.softDelete(id)
    }

    async delete(id: number): Promise<void> {
        await this.notificationRepository.delete(id)
    }

    async getMyList(userId: number): Promise<Notification[]> {
        return await this.notificationRepository.findBy({userId})
    }

    async getMyListCount(userId: number): Promise<number> {
        return await this.notificationRepository.count({where: {userId}})
    }
}