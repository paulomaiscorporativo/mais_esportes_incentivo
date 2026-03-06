import {
    Controller, Post, Get, Patch, Body, Param, UseGuards, Request
} from '@nestjs/common';
import { EmployeeLinkService } from './employee-link.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'mais-database';

@Controller('links')
@UseGuards(JwtAuthGuard)
export class EmployeeLinkController {
    constructor(private readonly employeeLinkService: EmployeeLinkService) { }

    /** POST /links/request - Vendedor solicita vínculo pelo CNPJ da empresa */
    @Post('request')
    requestLink(@Request() req: any, @Body('storeCnpj') storeCnpj: string) {
        return this.employeeLinkService.requestLink(req.user.userId, storeCnpj);
    }

    /** GET /links/my-status - Vendedor consulta status dos seus vínculos */
    @Get('my-status')
    getMyLinks(@Request() req: any) {
        return this.employeeLinkService.getMyLinks(req.user.userId);
    }

    /** GET /links/pending - Empresa lista vínculos pendentes */
    @UseGuards(RolesGuard)
    @Roles(Role.CNPJ_MASTER)
    @Get('pending')
    getPendingLinks(@Request() req: any) {
        return this.employeeLinkService.getPendingLinks(req.user.userId);
    }

    /** GET /links/team - Empresa lista todos os vínculos (aprovados, pendentes, rejeitados) */
    @UseGuards(RolesGuard)
    @Roles(Role.CNPJ_MASTER)
    @Get('team')
    getAllLinks(@Request() req: any) {
        return this.employeeLinkService.getAllLinks(req.user.userId);
    }

    /** GET /links/pending-count - Empresa verifica quantos vínculos estão pendentes (para badge no dashboard) */
    @UseGuards(RolesGuard)
    @Roles(Role.CNPJ_MASTER)
    @Get('pending-count')
    getPendingCount(@Request() req: any) {
        return this.employeeLinkService.countPendingLinks(req.user.userId);
    }

    /** PATCH /links/:id/respond - Empresa aprova ou recusa um vínculo */
    @UseGuards(RolesGuard)
    @Roles(Role.CNPJ_MASTER)
    @Patch(':id/respond')
    respondToLink(
        @Request() req: any,
        @Param('id') linkId: string,
        @Body('approve') approve: boolean,
    ) {
        return this.employeeLinkService.respondToLink(linkId, req.user.userId, approve);
    }

    /** PATCH /links/:id/percentage - Empresa define a % de coins de um vendedor aprovado */
    @UseGuards(RolesGuard)
    @Roles(Role.CNPJ_MASTER)
    @Patch(':id/percentage')
    updatePercentage(
        @Request() req: any,
        @Param('id') linkId: string,
        @Body('percentage') percentage: number,
    ) {
        return this.employeeLinkService.updatePercentage(linkId, req.user.userId, percentage);
    }
}
