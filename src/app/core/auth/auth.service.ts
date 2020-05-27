import { Inject, Injectable, Optional } from '@angular/core';
import { PRIMARY_OUTLET, Router, UrlSegmentGroup, UrlTree } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';

import { Observable, of as observableOf, timer as observableTimer } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import { CookieAttributes } from 'js-cookie';

import { EPerson } from '../eperson/models/eperson.model';
import { AuthRequestService } from './auth-request.service';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';
import { AuthStatus } from './models/auth-status.model';
import { AuthTokenInfo, TOKENITEM } from './models/auth-token-info.model';
import { hasValue, isEmpty, isNotEmpty, isNotNull, isNotUndefined } from '../../shared/empty.util';
import { CookieService } from '../services/cookie.service';
import { getAuthenticationToken, getRedirectUrl, isAuthenticated, isTokenRefreshing } from './selectors';
import { AppState, routerStateSelector } from '../../app.reducer';
import {
  CheckAuthenticationTokenAction,
  ResetAuthenticationMessagesAction,
  SetRedirectUrlAction
} from './auth.actions';
import { NativeWindowRef, NativeWindowService } from '../services/window.service';
import { Base64EncodeUrl } from '../../shared/utils/encode-decode.util';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { GlobalConfig } from '../../../config/global-config.interface';
import { GLOBAL_CONFIG } from '../../../config';
import { RouteService } from '../services/route.service';
import { Subscription } from 'rxjs/internal/Subscription';

export const LOGIN_ROUTE = '/login';
export const LOGOUT_ROUTE = '/logout';
export const REDIRECT_COOKIE = 'dsRedirectUrl';

/**
 * The auth service.
 */
@Injectable()
export class AuthService {

  /**
   * True if authenticated
   * @type boolean
   */
  protected _authenticated: boolean;

  /**
   * Subscription
   */
  protected tokenExpirationSub: Subscription;

  constructor(@Inject(GLOBAL_CONFIG) public config: GlobalConfig,
              @Inject(REQUEST) protected req: any,
              @Inject(NativeWindowService) protected _window: NativeWindowRef,
              protected authRequestService: AuthRequestService,
              @Optional() @Inject(RESPONSE) private response: any,
              protected router: Router,
              protected routeService: RouteService,
              protected storage: CookieService,
              protected store: Store<AppState>,
              protected rdbService: RemoteDataBuildService
  ) {
    this.store.pipe(
      select(isAuthenticated),
      startWith(false)
    ).subscribe((authenticated: boolean) => this._authenticated = authenticated);

    // If current route is different from the one setted in authentication guard
    // and is not the login route, clear redirect url and messages
    const routeUrl$ = this.store.pipe(
      select(routerStateSelector),
      filter((routerState: RouterReducerState) => isNotUndefined(routerState) && isNotUndefined(routerState.state)),
      filter((routerState: RouterReducerState) => !this.isLoginRoute(routerState.state.url)),
      map((routerState: RouterReducerState) => routerState.state.url)
    );
    const redirectUrl$ = this.store.pipe(select(getRedirectUrl), distinctUntilChanged());
    routeUrl$.pipe(
      withLatestFrom(redirectUrl$),
      map(([routeUrl, redirectUrl]) => [routeUrl, redirectUrl])
    ).pipe(filter(([routeUrl, redirectUrl]) => isNotEmpty(redirectUrl) && (routeUrl !== redirectUrl)))
      .subscribe(() => {
        this.clearRedirectUrl();
      });
  }

  /**
   * Check if is a login page route
   *
   * @param {string} url
   * @returns {Boolean}.
   */
  protected isLoginRoute(url: string) {
    const urlTree: UrlTree = this.router.parseUrl(url);
    const g: UrlSegmentGroup = urlTree.root.children[PRIMARY_OUTLET];
    const segment = '/' + g.toString();
    return segment === LOGIN_ROUTE;
  }

  /**
   * Authenticate the user
   *
   * @param {string} user The user name
   * @param {string} password The user's password
   * @returns {Observable<User>} The authenticated user observable.
   */
  public authenticate(user: string, password: string): Observable<AuthStatus> {
    // Attempt authenticating the user using the supplied credentials.
    const body = (`password=${Base64EncodeUrl(password)}&user=${Base64EncodeUrl(user)}`);
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    options.headers = headers;
    return this.authRequestService.postToEndpoint('login', body, options).pipe(
      map((status: AuthStatus) => {
        if (status.authenticated) {
          return status;
        } else {
          throw(new Error('Invalid email or password'));
        }
      }))

  }

  /**
   * Determines if the user is authenticated
   * @returns {Observable<boolean>}
   */
  public isAuthenticated(): Observable<boolean> {
    return this.store.pipe(select(isAuthenticated));
  }

  /**
   * Returns the authenticated user
   * @returns {User}
   */
  public authenticatedUser(token: AuthTokenInfo): Observable<EPerson> {
    // Determine if the user has an existing auth session on the server
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Authorization', `Bearer ${token.accessToken}`);
    options.headers = headers;
    return this.authRequestService.getRequest('status', options).pipe(
      map((status) => this.rdbService.build(status)),
      switchMap((status: AuthStatus) => {
        if (status.authenticated) {
          return status.eperson.pipe(map((eperson) => eperson.payload));
        } else {
          throw(new Error('Not authenticated'));
        }
      }))
  }

  /**
   * Checks if token is present into browser storage and is valid. (NB Check is done only on SSR)
   */
  public checkAuthenticationToken() {
    this.store.dispatch(new CheckAuthenticationTokenAction())
  }

  /**
   * Checks if token is present into storage and is not expired
   */
  public hasValidAuthenticationToken(): Observable<AuthTokenInfo> {
    return this.store.pipe(
      select(getAuthenticationToken),
      take(1),
      map((authTokenInfo: AuthTokenInfo) => {
        let token: AuthTokenInfo;
        // Retrieve authentication token info and check if is valid
        token = isNotEmpty(authTokenInfo) ? authTokenInfo : this.storage.get(TOKENITEM);
        if (isNotEmpty(token) && token.hasOwnProperty('accessToken') && isNotEmpty(token.accessToken) && !this.isTokenExpired(token)) {
          return token;
        } else {
          throw false;
        }
      })
    );
  }

  /**
   * Checks if token is present into storage
   */
  public refreshAuthenticationToken(token: AuthTokenInfo): Observable<AuthTokenInfo> {
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Authorization', `Bearer ${token.accessToken}`);
    options.headers = headers;
    return this.authRequestService.postToEndpoint('login', {}, options).pipe(
      map((status: AuthStatus) => {
        if (status.authenticated) {
          return status.token;
        } else {
          throw(new Error('Not authenticated'));
        }
      }));
  }

  /**
   * Clear authentication errors
   */
  public resetAuthenticationError(): void {
    this.store.dispatch(new ResetAuthenticationMessagesAction());
  }

  /**
   * Retrieve authentication methods available
   * @returns {User}
   */
  public retrieveAuthMethods(): Observable<AuthStatus> {
    return this.authRequestService.getRequest('login').pipe(
      map((status: AuthStatus) => {
        let url = '';
        if (isNotEmpty(status.ssoLoginUrl)) {
          url = this.parseSSOLocation(status.ssoLoginUrl);
        }
        return Object.assign({}, status, {
          ssoLoginUrl: url
        })
      }));
  }

  private parseSSOLocation(url: string): string {
    const parseUrl = decodeURIComponent(url);
    // const urlTree: UrlTree = this.router.parseUrl(url);
    // this.router.parseUrl(url);
    // if (url.endsWith('/')) {
    //   url += 'login';
    // } else {
    //   url = url.replace('/?target=http(.+)/g', 'https://hasselt-dspace.dev01.4science.it/dspace-spring-rest/shib.html');
    // }
    // console.log(url);
    const target = `?target=${this.config.auth.target.host}${this.config.auth.target.page}`;
    return parseUrl.replace(/\?target=http.+/g, target);
  }

  /**
   * Create a new user
   * @returns {User}
   */
  public create(user: EPerson): Observable<EPerson> {
    // Normally you would do an HTTP request to POST the user
    // details and then return the new user object
    // but, let's just return the new user for this example.
    // this._authenticated = true;
    return observableOf(user);
  }

  /**
   * End session
   * @returns {Observable<boolean>}
   */
  public logout(): Observable<boolean> {
    // Send a request that sign end the session
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const options: HttpOptions = Object.create({ headers, responseType: 'text' });
    return this.authRequestService.getRequest('logout', options).pipe(
      map((status: AuthStatus) => {
        if (!status.authenticated) {
          return true;
        } else {
          throw(new Error('auth.errors.invalid-user'));
        }
      }))
  }

  /**
   * Retrieve authentication token info and make authorization header
   * @returns {string}
   */
  public buildAuthHeader(token?: AuthTokenInfo): string {
    if (isEmpty(token)) {
      token = this.getToken();
    }
    return (this._authenticated && isNotNull(token)) ? `Bearer ${token.accessToken}` : '';
  }

  /**
   * Get authentication token info
   * @returns {AuthTokenInfo}
   */
  public getToken(): AuthTokenInfo {
    let token: AuthTokenInfo;
    this.store.pipe(select(getAuthenticationToken))
      .subscribe((authTokenInfo: AuthTokenInfo) => {
        // Retrieve authentication token info and check if is valid
        token = authTokenInfo || null;
      });
    return token;
  }

  /**
   * Check if a token is next to be expired
   * @returns {boolean}
   */
  public isTokenExpiring(): Observable<boolean> {
    return this.store.pipe(
      select(isTokenRefreshing),
      take(1),
      map((isRefreshing: boolean) => {
        if (this.isTokenExpired() || isRefreshing) {
          return false;
        } else {
          const token = this.getToken();
          return token.expires - (60 * 5 * 1000) < Date.now();
        }
      })
    )
  }

  /**
   * Check if a token is expired
   * @returns {boolean}
   */
  public isTokenExpired(token?: AuthTokenInfo): boolean {
    token = token || this.getToken();
    return token && token.expires < Date.now();
  }

  /**
   * Save authentication token info
   *
   * @param {AuthTokenInfo} token The token to save
   * @returns {AuthTokenInfo}
   */
  public storeToken(token: AuthTokenInfo) {
    // Add 1 day to the current date
    const expireDate = Date.now() + (1000 * 60 * 60 * 24);

    // Set the cookie expire date
    const expires = new Date(expireDate);
    const options: CookieAttributes = { expires: expires };

    this.subscribeToTokenExpiration(token);

    // Save cookie with the token
    return this.storage.set(TOKENITEM, token, options);
  }

  private subscribeToTokenExpiration(token: AuthTokenInfo) {
    this.unsubscribeFromTokenExpiration();
    // Retrieve interval from token
    const duration = Math.ceil(token.expires - Date.now());

    // Dispatch refresh page action after given duration
    const timer$ = observableTimer(duration, duration);
    this.tokenExpirationSub = timer$
      .subscribe(() => {
        console.log('Refreshing page after session expired');
        this.refreshCurrentPage()
      });
  }

  private unsubscribeFromTokenExpiration() {
    if (hasValue(this.tokenExpirationSub)) {
      this.tokenExpirationSub.unsubscribe();
      this.tokenExpirationSub = null;
    }
  }

  private refreshCurrentPage() {
    this._window.nativeWindow.location.href = this._window.nativeWindow.location.href;
  }

  /**
   * Remove authentication token info
   */
  public removeToken() {
    return this.storage.remove(TOKENITEM);
  }

  /**
   * Replace authentication token info with a new one
   */
  public replaceToken(token: AuthTokenInfo) {
    this.removeToken();
    return this.storeToken(token);
  }

  /**
   * Redirect to the login route
   */
  public redirectToLogin() {
    this.router.navigate([LOGIN_ROUTE]);
  }

  /**
   * Redirect to the login route when token has expired
   */
  public redirectToLoginWhenTokenExpired() {
    if (this._window.nativeWindow.location) {
      // Hard redirect to login page, so that all state is definitely lost
      this._window.nativeWindow.location.href = this.getLoginRedirectUrl();
    } else if (this.response) {
      if (!this.response._headerSent) {
        this.response.redirect(302, this.getLoginRedirectUrl());
      }
    } else {
      this.router.navigateByUrl(LOGIN_ROUTE);
    }
  }

  /**
   * Redirect to the route navigated before the login
   */
  public redirectAfterLoginSuccess(isStandalonePage: boolean) {
    this.getRedirectUrl().pipe(
      take(1))
      .subscribe((redirectUrl) => {

        if (isNotEmpty(redirectUrl)) {
          this.clearRedirectUrl();
          this.router.onSameUrlNavigation = 'reload';
          const url = decodeURIComponent(redirectUrl);
          this.navigateToRedirectUrl(url);
        } else {
          // If redirectUrl is empty use history.
          this.routeService.getHistory().pipe(
            take(1)
          ).subscribe((history) => {
            let redirUrl;
            if (isStandalonePage) {
              // For standalone login pages, use the previous route.
              redirUrl = history[history.length - 2] || '';
            } else {
              redirUrl = history[history.length - 1] || '';
            }
            this.navigateToRedirectUrl(redirUrl);
          });
        }
      });

  }

  protected navigateToRedirectUrl(url: string) {
    // in case the user navigates directly to /login (via bookmark, etc), or the route history is not found.
    if (isEmpty(url) || url.startsWith(LOGIN_ROUTE)) {
      this.router.navigate(['/']);
      /* TODO Reenable hard redirect when REST API can handle x-forwarded-for, see https://github.com/DSpace/DSpace/pull/2207 */
      // this._window.nativeWindow.location.href = '/';
    } else {
      /* TODO Reenable hard redirect when REST API can handle x-forwarded-for, see https://github.com/DSpace/DSpace/pull/2207 */
      // this._window.nativeWindow.location.href = url;
      this.router.navigateByUrl(url);
    }
  }

  /**
   * Refresh route navigated
   */
  public refreshAfterLogout() {
    // this.router.navigate(['/home']);
    // Hard redirect to home page, so that all state is definitely lost
    this._window.nativeWindow.location.href = this.config.auth.target.host + '/logout';
  }

  /**
   * Get redirect url
   */
  getRedirectUrl(): Observable<string> {
    const redirectUrl = this.storage.get(REDIRECT_COOKIE);
    if (isNotEmpty(redirectUrl)) {
      return observableOf(redirectUrl);
    } else {
      return this.store.pipe(select(getRedirectUrl));
    }
  }

  /**
   * Set redirect url
   */
  setRedirectUrl(url: string) {
    // Add 1 hour to the current date
    const expireDate = Date.now() + (1000 * 60 * 60);

    // Set the cookie expire date
    const expires = new Date(expireDate);
    const options: CookieAttributes = { expires: expires };
    this.storage.set(REDIRECT_COOKIE, url, options);
    this.store.dispatch(new SetRedirectUrlAction(isNotUndefined(url) ? url : ''));
  }

  /**
   * Clear redirect url
   */
  clearRedirectUrl() {
    this.store.dispatch(new SetRedirectUrlAction(''));
    this.storage.remove(REDIRECT_COOKIE);
  }

  /**
   * Get login url
   */
  getLoginRedirectUrl() {
    return (this.config.ui.nameSpace !== '/') ? this.config.ui.nameSpace + LOGIN_ROUTE : LOGIN_ROUTE;
  }

  /**
   * Get logout url
   */
  getLogoutRedirectUrl() {
    return (this.config.ui.nameSpace !== '/') ? this.config.ui.nameSpace + LOGOUT_ROUTE : LOGOUT_ROUTE;
  }
}
