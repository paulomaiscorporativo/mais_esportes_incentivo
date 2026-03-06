import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { SubmitInvoiceDto } from './dto/submit-invoice.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Invoice } from 'mais-database';

@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoiceController {
    constructor(private invoiceService: InvoiceService) { }

    @Post('submit')
    submit(@Request() req: any, @Body() dto: SubmitInvoiceDto): Promise<Invoice> {
        return this.invoiceService.submit(req.user.userId, dto.accessKey);
    }

    @Get()
    list(@Request() req: any): Promise<Invoice[]> {
        return this.invoiceService.listByUser(req.user.userId);
    }
}
