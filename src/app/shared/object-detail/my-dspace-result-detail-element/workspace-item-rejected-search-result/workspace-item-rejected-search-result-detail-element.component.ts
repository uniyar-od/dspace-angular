import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { find } from 'rxjs/operators';

import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { SearchResultDetailElementComponent } from '../search-result-detail-element.component';
import { WorkspaceItem } from '../../../../core/submission/models/workspaceitem.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { isNotUndefined } from '../../../empty.util';
import { Item } from '../../../../core/shared/item.model';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { Context } from '../../../../core/shared/context.model';
import { WorkflowItemSearchResult } from '../../../object-collection/shared/workflow-item-search-result.model';

@Component({
  selector: 'ds-workspaceitem-search-result-list-element',
  styleUrls: ['../search-result-detail-element.component.scss', './workspace-item-rejected-search-result-detail-element.component.scss'],
  templateUrl: './workspace-item-rejected-search-result-detail-element.component.html',
})

@listableObjectComponent(WorkflowItemSearchResult, ViewMode.DetailedListElement, Context.Workflow)
export class WorkspaceItemRejectedSearchResultDetailElementComponent extends SearchResultDetailElementComponent<WorkflowItemSearchResult, WorkspaceItem> {

  item: Item;
  status = MyDspaceItemStatusType.REJECTED;

  ngOnInit() {
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
