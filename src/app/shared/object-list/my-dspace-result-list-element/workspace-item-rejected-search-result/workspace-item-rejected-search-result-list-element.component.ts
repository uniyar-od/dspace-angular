import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { SearchResultListElementComponent } from '../../search-result-list-element/search-result-list-element.component';
import { WorkspaceItem } from '../../../../core/submission/models/workspaceitem.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { Item } from '../../../../core/shared/item.model';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { find } from 'rxjs/operators';
import { isNotUndefined } from '../../../empty.util';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { Context } from '../../../../core/shared/context.model';
import { WorkspaceItemSearchResult } from '../../../object-collection/shared/workspace-item-search-result.model';

/**
 * This component renders workspaceitem object for the search result in the list view.
 */
@Component({
  selector: 'ds-workspaceitem-my-dspace-result-list-element',
  styleUrls: ['../../search-result-list-element/search-result-list-element.component.scss', './workspace-item-rejected-search-result-list-element.component.scss'],
  templateUrl: './workspace-item-rejected-search-result-list-element.component.html',
})

@listableObjectComponent(WorkspaceItemSearchResult, ViewMode.ListElement, Context.Workflow)
export class WorkspaceItemRejectedSearchResultListElementComponent extends SearchResultListElementComponent<WorkspaceItemSearchResult, WorkspaceItem> {

  /**
   * The item object that belonging to the result object
   */
  item: Item;

  /**
   * Represent item's status
   */
  status = MyDspaceItemStatusType.REJECTED;

  /**
   * Initialize all instance variables
   */
  ngOnInit() {
    super.ngOnInit();
    this.initItem(this.dso.item as Observable<RemoteData<Item>>);
  }

  /**
   * Retrieve item from result object
   */
  initItem(item$: Observable<RemoteData<Item>>) {
    this.subs.push(
      item$.pipe(
        find((rd: RemoteData<Item>) => rd.hasSucceeded && isNotUndefined(rd.payload))
      ).subscribe((rd: RemoteData<Item>) => {
        this.item = rd.payload;
      })
    );
  }

}
