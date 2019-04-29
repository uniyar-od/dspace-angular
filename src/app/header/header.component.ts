import { Component, Inject, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { MenuService } from '../shared/menu/menu.service';
import { MenuID } from '../shared/menu/initial-menus-state';
import { GLOBAL_CONFIG, GlobalConfig } from '../../config';

/**
 * Represents the header with the logo and simple navigation
 */
@Component({
  selector: 'ds-header',
  styleUrls: ['header.component.scss'],
  templateUrl: 'header.component.html',
})
export class HeaderComponent implements OnInit {
  /**
   * Whether user is authenticated.
   * @type {Observable<string>}
   */
  public isAuthenticated: Observable<boolean>;
  public isNavBarCollapsed: Observable<boolean>;
  public showAuth = false;
  public homeHref: string;
  menuID = MenuID.PUBLIC;

  constructor(
    @Inject(GLOBAL_CONFIG) public config: GlobalConfig,
    private menuService: MenuService
  ) {
  }

  ngOnInit(): void {
    // set loading
    this.isNavBarCollapsed = this.menuService.isMenuCollapsed(this.menuID);
    this.homeHref = this.config.auth.target.host;
  }

  public toggleNavbar(): void {
    this.menuService.toggleMenu(this.menuID);
  }
}
