import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { NormalizedCollection } from '../cache/models/normalized-collection.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { CoreState } from '../core.reducers';
import { Collection } from '../shared/collection.model';
import { ComColDataService } from './comcol-data.service';
import { CommunityDataService } from './community-data.service';
import { RequestService } from './request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { Observable } from 'rxjs/Observable';
import { FindAllOptions } from './request.models';
import { RemoteData } from './remote-data';
import { PaginatedList } from './paginated-list';
import { SearchParam } from '../cache/models/search-param.model';

@Injectable()
export class CollectionDataService extends ComColDataService<NormalizedCollection, Collection> {
  protected linkPath = 'collections';
  protected forceBypassCache = false;

  constructor(
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected cds: CommunityDataService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService
  ) {
    super();
  }

  /**
   * Get all collections whom user has authorization to submit to by community
   *
   * @return boolean
   *    true if the user has at least one collection to submit to
   */
  getAuthorizedCollectionByCommunity(communityId): Observable<RemoteData<PaginatedList<Collection>>> {
    const searchHref = 'findAuthorizedByCommunity';
    const options = new FindAllOptions();
    options.elementsPerPage = 1000;
    options.searchParams = [new SearchParam('uuid', communityId)];

    return this.searchBy(searchHref, options)
      .filter((collections: RemoteData<PaginatedList<Collection>>) => !collections.isResponsePending);
  }
}
