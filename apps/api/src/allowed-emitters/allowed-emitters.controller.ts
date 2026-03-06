import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AllowedEmittersService } from './allowed-emitters.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@mais-corporativo/database';

@Controller('allowed-emitters')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AllowedEmittersController {
    constructor(private readonly service: AllowedEmittersService) { }

    /** GET /allowed-emitters — Lista todos os emissores */
    @Get()
    findAll() {
        return this.service.findAll();
    }

    /** POST /allowed-emitters — Adiciona novo CNPJ autorizado */
    @Post()
    create(@Body('cnpj') cnpj: string, @Body('name') name: string) {
        return this.service.create(cnpj, name);
    }

    /** PATCH /allowed-emitters/:id/toggle — Ativa/desativa um emissor */
    @Patch(':id/toggle')
    toggle(@Param('id') id: string) {
        return this.service.toggleActive(id);
    }

    /** DELETE /allowed-emitters/:id — Remove um emissor */
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
