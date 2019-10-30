import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { Inject, Injectable, Optional } from '@angular/core';
import { Response } from 'express';
import { NativeWindowRef, NativeWindowService } from './window.service';
import { isNotEmpty } from '../../shared/empty.util';

@Injectable()
export class ServerResponseService {
  private response: Response;

  constructor(@Optional() @Inject(RESPONSE) response: any,
              @Inject(NativeWindowService) protected _window: NativeWindowRef) {
    this.response = response;
  }

  setStatus(code: number, message?: string): this {
    if (this.response) {
      this.response.statusCode = code;
      if (message) {
        this.response.statusMessage = message;
      }
    }
    return this;
  }

  setNotFound(message = 'Not found'): this {
    return this.setStatus(404, message)
  }

  redirect(url: string): void {
    if (isNotEmpty(url)) {
      if (this.response) {
        this.response.redirect(url);
      } else {
        this._window.nativeWindow.location.href = url;
      }
    }
  }
}
