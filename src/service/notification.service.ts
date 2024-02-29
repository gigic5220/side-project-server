import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, UpdateResult} from 'typeorm';
import {Notification} from "../entity/notification.entity";
import {CreateNotificationDto} from "../dto/createNotification.dto";

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>
    ) {}

    async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
        return await this.notificationRepository.save(createNotificationDto);
    }

    async update(id: number): Promise<UpdateResult> {
        console.log('update', id)
        return await this.notificationRepository.update(id, {isRead: true});
    }

    async softDelete(id: number): Promise<void> {
        await this.notificationRepository.softDelete(id)
    }

    async delete(id: number): Promise<void> {
        await this.notificationRepository.delete(id)
    }

    async getMyList(userId: number): Promise<Notification[]> {
        return await this.notificationRepository.findBy({userId, isRead: false})
    }

    async getMyListCount(userId: number): Promise<number> {
        return await this.notificationRepository.count({where: {userId, isRead: false}})
    }
}