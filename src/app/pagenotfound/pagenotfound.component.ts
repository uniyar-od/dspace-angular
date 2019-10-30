import { ServerResponseService } from '../core/services/server-response.service';
import { Component, ChangeDetectionStrategy, OnInit, Inject } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';
import { GLOBAL_CONFIG, GlobalConfig } from '../../config';

/**
 * This component representing the `PageNotFound` DSpace page.
 */
@Component({
  selector: 'ds-pagenotfound',
  styleUrls: ['./pagenotfound.component.scss'],
  templateUrl: './pagenotfound.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class PageNotFoundComponent implements OnInit {

  public homeHref: string;

  /**
   * Initialize instance variables
   *
   * @param {GlobalConfig} config
   * @param {AuthService} authservice
   * @param {ServerResponseService} responseService
   */
  constructor(
    @Inject(GLOBAL_CONFIG) public config: GlobalConfig,
    private authservice: AuthService,
    private responseService: ServerResponseService) {
    this.responseService.setNotFound();
  }

  /**
   * Remove redirect url from the state
   */
  ngOnInit(): void {
    this.authservice.clearRedirectUrl();
    this.homeHref = this.config.auth.target.host + this.config.auth.target.nameSpace;
  }

}
