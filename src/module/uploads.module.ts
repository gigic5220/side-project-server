import {Module} from '@nestjs/common';
import {UploadsController} from "../controller/uploads.controller";
import {UploadsService} from "../service/upload.service";

@Module({
    controllers: [UploadsController],
    providers: [UploadsService],
})
export class UploadsModule {}
