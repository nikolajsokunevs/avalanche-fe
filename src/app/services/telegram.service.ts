import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TelegramService {
  
  private tg;
  private window;

  constructor(@Inject(DOCUMENT) private _document) { 
    this.window=this._document.defaultView;
    this.tg=this.window.Telegram.WebApp;
  }

  getUserData(): any {
    const initData = this.tg.initData;
    const params = new URLSearchParams(initData);
    const userData = params.get('user');

    if (userData) {
      return JSON.parse(decodeURIComponent(userData));
    } else {
      throw new Error('User data not found in initData');
    }
  }

  getInitData(): String{
    return this.tg.initData;
  }
}