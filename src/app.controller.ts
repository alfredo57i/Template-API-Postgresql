import { Controller, Get, Req } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() { }

  @Get('ping')
  async ping(@Req() req: Request) {
    return {
      server: 'OK',
      url: req.url,
      method: req.method,
      headers: req.headers,
    };
  }
}
