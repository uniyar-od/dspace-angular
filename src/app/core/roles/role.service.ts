import { Injectable } from '@angular/core';

import { interval, Observable, race } from 'rxjs';
import { distinctUntilChanged, map, mapTo, mergeMap, take } from 'rxjs/operators';

import { RoleType } from './role-types';
import { CollectionDataService } from '../data/collection-data.service';
import { GroupDataService } from '../eperson/group-data.service';
import { ConfigurationDataService } from '../data/configuration-data.service';
import { getFirstSucceededRemoteDataPayload } from '../shared/operators';
import { ConfigurationProperty } from '../shared/configuration-property.model';

/**
 * A service that provides methods to identify user role.
 */
@Injectable()
export class RoleService {

  /**
   * Initialize instance variables
   *
   * @param {CollectionDataService} collectionService
   * @param {ConfigurationDataService} configService
   * @param {GroupDataService} groupService
   */
  constructor(
    private collectionService: CollectionDataService,
    private configService: ConfigurationDataService,
    private groupService: GroupDataService) {
  }

  /**
   * Check if current user is a submitter
   */
  isSubmitter(): Observable<boolean> {
    return this.collectionService.hasAuthorizedCollection().pipe(
      distinctUntilChanged(),
      take(1)
    );
  }

  /**
   * Check if current user is a controller
   */
  isController(): Observable<boolean> {
    return race([
        this.groupService.isMemberOf('Controllers'),
        interval(5000).pipe(mapTo(false))
    ]).pipe(
      take(1)
    );
  }

  /**
   * Check if current user is an admin
   */
  isAdmin(): Observable<boolean> {
    return race([
      this.groupService.isMemberOf('Administrator'),
      interval(5000).pipe(mapTo(false))
    ]).pipe(
      take(1)
    );
  }

  isMemberOfRSOSGroup(): Observable<boolean> {
    const isMemberOf$ = this.configService.findByPropertyName('workflow.rsos.group').pipe(
      getFirstSucceededRemoteDataPayload(),
      map((response: ConfigurationProperty) => response.values[0]),
      mergeMap((groupName: string) => this.groupService.isMemberOf(groupName))
    );
    return race([
      isMemberOf$,
      interval(5000).pipe(mapTo(false))
    ]).pipe(
      take(1)
    );
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
