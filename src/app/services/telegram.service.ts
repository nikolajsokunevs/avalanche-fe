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
    this.tg = this.window?.Telegram?.WebApp;

    if (!this.tg) {
      console.warn('Telegram WebApp is not defined. Make sure you are in the correct environment.');
    }
  }

  getUserData(): any {
    if (!this.tg) {
      throw new Error('Telegram WebApp is not initialized.');
    }

    const initData = this.tg.initData;
    const params = new URLSearchParams(initData);
    const userData = params.get('user');

    if (userData) {
      return JSON.parse(decodeURIComponent(userData));
    } else {
      throw new Error('User data not found in initData');
    }
  }


  getInitData(): string {
    if (!this.tg) {
      throw new Error('Telegram WebApp is not initialized.');
    }
    return this.tg.initData;
  }
}