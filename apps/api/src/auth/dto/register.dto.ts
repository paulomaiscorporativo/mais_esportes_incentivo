import { Role } from '@mais-corporativo/database';

export class RegisterDto {
    email: string;
    passwordHash: string;
    name: string;
    document: string;
    role: Role;
    storeId?: string;
    favoriteTeam?: string;
}
