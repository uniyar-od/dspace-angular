import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { slideMobileNav } from '../shared/animations/slide';
import { MenuComponent } from '../shared/menu/menu.component';
import { MenuService } from '../shared/menu/menu.service';
import { MenuID } from '../shared/menu/initial-menus-state';
import { HostWindowService } from '../shared/host-window.service';

/**
 * Component representing the public navbar
 */
@Component({
  selector: 'ds-navbar',
  styleUrls: ['./navbar.component.scss'],
  templateUrl: './navbar.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [slideMobileNav]
})
export class NavbarComponent extends MenuComponent implements OnInit {
  /**
   * The menu ID of the Navbar is PUBLIC
   * @type {MenuID.PUBLIC}
   */
  menuID = MenuID.PUBLIC;

  constructor(protected menuService: MenuService,
              protected injector: Injector,
              public windowService: HostWindowService
  ) {
    super(menuService, injector);
  }

  ngOnInit(): void {
    this.createMenu();
    super.ngOnInit();
  }

  /**
   * Initialize all menu sections and items for this menu
   */
  createMenu() {
    const menuList = [];
    menuList.forEach((menuSection) => this.menuService.addSection(this.menuID, menuSection));

  }

}
