import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@mais-corporativo/database';

@Controller('profile')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getProfile(@Request() req: any) {
        const user = await this.usersService.findById(req.user.userId);
        if (!user) return null;

        const { passwordHash, ...result } = user;
        return result;
    }

    // CMS Endpoints
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get('cms/list')
    findAll() {
        return this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post('cms/create')
    create(@Body() data: any) {
        return this.usersService.create(data);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Patch('cms/:id')
    update(@Param('id') id: string, @Body() data: any) {
        return this.usersService.update(id, data);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('cms/:id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get('cms/stats/leaderboard')
    getLeaderboard() {
        return this.usersService.getLeaderboard();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get('cms/stats/global')
    getGlobalStats() {
        return this.usersService.getGlobalStats();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get('cms/stats/insights')
    getInsights() {
        return this.usersService.getInsights();
    }
}
