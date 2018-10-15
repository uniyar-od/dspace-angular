import {Component, Inject, OnDestroy, OnInit} from '@angular/core';

import { Store } from '@ngrx/store';

import { AppState } from '../app.reducer';
import {
  AddAuthenticationMessageAction,
  AuthenticatedAction,
  AuthenticationSuccessAction,
  ResetAuthenticationMessagesAction
} from '../core/auth/auth.actions';
import { Subscription } from 'rxjs/Subscription';
import {hasValue, isEmpty, isNotEmpty} from '../shared/empty.util';
import {ActivatedRoute, Router} from '@angular/router';
import { AuthTokenInfo } from '../core/auth/models/auth-token-info.model';
import { Observable } from 'rxjs/Observable';
import {getSSOLoginUrl, isAuthenticated} from '../core/auth/selectors';
import {NativeWindowRef, NativeWindowService} from '../shared/services/window.service';

@Component({
  selector: 'ds-login-page',
  styleUrls: ['./login-page.component.scss'],
  templateUrl: './login-page.component.html'
})
export class LoginPageComponent implements OnDestroy, OnInit {
  subs: Subscription[] = [];

  constructor(@Inject(NativeWindowService) protected _window: NativeWindowRef,
              private route: ActivatedRoute,
              private router: Router,
              private store: Store<AppState>) {}

  ngOnInit() {
    const queryParamsObs = this.route.queryParams;
    const authenticated = this.store.select(isAuthenticated);
    const SSOLoginUrl = this.store.select(getSSOLoginUrl);
    this.subs.push(Observable.combineLatest(queryParamsObs, authenticated)
      .filter(([params, auth]) => isNotEmpty(params.token) || isNotEmpty(params.expired))
      .take(1)
      .subscribe(([params, auth]) => {
        const token = params.token;
        let authToken: AuthTokenInfo;
        if (!auth) {
          if (isNotEmpty(token)) {
            authToken = new AuthTokenInfo(token);
            this.store.dispatch(new AuthenticatedAction(authToken));
          } else if (isNotEmpty(params.expired)) {
            this.store.dispatch(new AddAuthenticationMessageAction('auth.messages.expired'));
          }
        } else {
          if (isNotEmpty(token)) {
            authToken = new AuthTokenInfo(token);
            this.store.dispatch(new AuthenticationSuccessAction(authToken));
          }
        }
      }),
      Observable.combineLatest(queryParamsObs, authenticated, SSOLoginUrl)
        .filter(([params, auth, url]) => isEmpty(params) && hasValue(url))
        .take(1)
        .subscribe(([params, auth, url]) => {
          if (!auth) {
            this._window.nativeWindow.location.href = url;
          }
        })
    )
  }

  ngOnDestroy() {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());

    // Clear all authentication messages when leaving login page
    this.store.dispatch(new ResetAuthenticationMessagesAction());
  }
}
