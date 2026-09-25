import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";

@Controller('users')
export class UsersController {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    @Post()
    async create(@Body() body: {
        id: string;
        name: string;
        phone?: string
    } ){
    const user = this.usersRepository.create(body);
        return this.usersRepository.save(user)
    }

    @Get(':id')
    async findOne( @Param('id') id: string ){
        return this.usersRepository.findOneBy({id})
    }
}