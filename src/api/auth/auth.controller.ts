import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { API_TAG } from 'src/swagger';
import { LoginAuthDto } from './dto';
import { RequestHeader } from 'src/interfaces';
import { User } from '../users/entities/user.entity';
import { name } from 'src/constants';
import { JwtSystemGuard, RecaptchaGuard } from 'src/middlewares/guards';

@ApiTags(API_TAG.Auth)
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UseGuards(RecaptchaGuard)
  login(@Body() body: LoginAuthDto) {
    return this.authService.login(body, true);
  }

  @Post('/login-employee')
  loginEmployee(@Body() body: LoginAuthDto) {
    return this.authService.login(body, false);
  }

  @Get('/profile')
  @ApiBearerAuth(name.JWT)
  @UseGuards(JwtSystemGuard)
  profile(@Req() req: RequestHeader<User>) {
    return this.authService.profile(req);
  }
  // @Post()
  // create(@Body() createAuthDto: CreateAuthDto) {
  //   return this.authService.create(createAuthDto);
  // }

  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
