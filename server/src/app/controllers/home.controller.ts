import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { responseSuccess } from '../../utils/responseParser';

@Controller('')
export class HomeController {
  @Get('')
  getAll(req: Request, res: Response) {
    // return responseSuccess(res, 'Home Controller');
    res.render('home');
  }
}
