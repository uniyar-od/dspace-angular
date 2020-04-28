import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { combineLatest as observableCombineLatest, Subscription } from 'rxjs';
import { filter, find, take } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { AppState } from '../app.reducer';
import {
  AddAuthenticationMessageAction,
  AuthenticatedAction,
  AuthenticationSuccessAction,
  ResetAuthenticationMessagesAction
} from '../core/auth/auth.actions';
import { hasValue, isEmpty, isNotEmpty } from '../shared/empty.util';
import { AuthTokenInfo } from '../core/auth/models/auth-token-info.model';
import { getSSOLoginUrl, isAuthenticated, isAuthenticationLoading } from '../core/auth/selectors';
import { ServerResponseService } from '../core/services/server-response.service';
import { AuthService } from '../core/auth/auth.service';

/**
 * This component represents the login page
 */
@Component({
  selector: 'ds-login-page',
  styleUrls: ['./login-page.component.scss'],
  templateUrl: './login-page.component.html'
})
export class LoginPageComponent implements OnDestroy, OnInit {

  /**
   * Subscription to unsubscribe onDestroy
   * @type {Subscription}
   */
  subs: Subscription[] = [];

  /**
   * Initialize instance variables
   *
   * @param {ActivatedRoute} route
   * @param {AuthService} authService
   * @param {ServerResponseService} responseService
   * @param {Store<AppState>} store
   */
  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private responseService: ServerResponseService,
              private store: Store<AppState>) {
  }

  /**
   * Initialize instance variables
   */
  ngOnInit() {
    const queryParamsObs = this.route.queryParams;
    const authenticated = this.store.pipe(select(isAuthenticated));
    const authenticationLoading = this.store.pipe(select(isAuthenticationLoading));
    const SSOLoginUrl = this.store.pipe(select(getSSOLoginUrl));
    this.subs.push(observableCombineLatest(authenticationLoading, queryParamsObs, authenticated).pipe(
      filter(([authLoading, params, auth]) => !authLoading && (isNotEmpty(params.token) || isNotEmpty(params.expired))),
      take(1)
      ).subscribe(([authLoading, params, auth]) => {
        const token = params.token;
        const redirectUrl = params.redirectUrl;
        let authToken: AuthTokenInfo;

        if (isNotEmpty(redirectUrl)) {
          this.authService.setRedirectUrl(redirectUrl);
        }
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
      observableCombineLatest(queryParamsObs, authenticated, SSOLoginUrl).pipe(
        find(([params, auth, url]) => isEmpty(params) && isNotEmpty(url))
      ).subscribe(([params, auth, url]) => {
        if (!auth) {
          this.responseService.redirect(url);
        }
      })
    )
  }

  /**
   * Unsubscribe from subscription
   */
  ngOnDestroy() {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());

    // Clear all authentication messages when leaving login page
    this.store.dispatch(new ResetAuthenticationMessagesAction());
  }
}
