import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { RoleType } from './role-types';
import { CollectionDataService } from '../data/collection-data.service';
import { GroupDataService } from '../eperson/group-data.service';

/**
 * A service that provides methods to identify user role.
 */
@Injectable()
export class RoleService {

  /**
   * Initialize instance variables
   *
   * @param {CollectionDataService} collectionService
   * @param {GroupDataService} groupService
   */
  constructor(private collectionService: CollectionDataService, private groupService: GroupDataService) {
  }

  /**
   * Check if current user is a submitter
   */
  isSubmitter(): Observable<boolean> {
    return this.collectionService.hasAuthorizedCollection().pipe(
      distinctUntilChanged()
    );
  }

  /**
   * Check if current user is a controller
   */
  isController(): Observable<boolean> {
    return this.groupService.isMemberOf('Controllers');
  }

  /**
   * Check if current user is an admin
   */
  isAdmin(): Observable<boolean> {
    return this.groupService.isMemberOf('Administrator');
  }

  /**
   * Check if current user by role type
   *
   * @param {RoleType} role
   *    the role type
   */
  checkRole(role: RoleType): Observable<boolean> {
    let check: Observable<boolean>;
    switch (role) {
      case RoleType.Submitter:
        check = this.isSubmitter();
        break;
      case RoleType.Controller:
        check = this.isController();
        break;
      case RoleType.Admin:
        check = this.isAdmin();
        break;
    }

    return check;
  }
}
