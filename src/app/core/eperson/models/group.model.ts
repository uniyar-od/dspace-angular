import { Observable } from 'rxjs/Observable';

import { DSpaceObject } from '../../shared/dspace-object.model';
import { PaginatedList } from '../../data/paginated-list';
import { RemoteData } from '../../data/remote-data';

export class Group extends DSpaceObject {

  /**
   * List of Groups that this Group belong to
   */
  public groups: Observable<RemoteData<Group[]>>;

  public handle: string;

  public permanent: boolean;
}
