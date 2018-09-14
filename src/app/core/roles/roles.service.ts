import { Injectable } from '@angular/core';
import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';
import { Eperson } from '../eperson/models/eperson.model';
import { Observable } from 'rxjs/Observable';
import { getAuthenticatedUser } from '../auth/selectors';
import { GroupEpersonService } from '../eperson/group-eperson.service';

@Injectable()
export class RolesService {
  user: Observable<Eperson>;

  constructor(private groupService: GroupEpersonService, private store: Store<AppState>) {
    this.user = this.store.select(getAuthenticatedUser);
  }

  protected groupExists(groupName): Observable<boolean> {
    return this.groupService.isMemberOf(groupName)
      .distinctUntilChanged()
  }

  isSubmitter(): Observable<boolean> {
    return this.groupExists('Submitters');
  }

  isController(): Observable<boolean> {
    return this.groupExists('Controllers');
  }

  isAdmin(): Observable<boolean> {
    return this.groupExists('Administrator');
  }
}
