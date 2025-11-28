import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwt: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        const hashed = await bcrypt.hash(dto.password, 10);
        return this.userService.create({
            ...dto,
            password: hashed,
        });
    }

    async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new NotFoundException('User not found');

    const passValid = await bcrypt.compare(dto.password, user.password);
    if (!passValid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwt.sign({ id: user.id, role: user.role });
    return { token };
}

}
