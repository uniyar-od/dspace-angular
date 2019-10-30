import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { find } from 'rxjs/operators';

import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { MyDSpaceResultDetailElementComponent } from '../my-dspace-result-detail-element.component';
import { WorkspaceItem } from '../../../../core/submission/models/workspaceitem.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { isNotUndefined } from '../../../empty.util';
import { Item } from '../../../../core/shared/item.model';
import { WorkspaceitemRejectedMyDSpaceResult } from '../../../object-collection/shared/workspaceitem-rejected-my-dspace-result.model';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { SetViewMode } from '../../../view-mode';

@Component({
  selector: 'ds-workspaceitem-my-dspace-result-list-element',
  styleUrls: ['../my-dspace-result-detail-element.component.scss', './workspaceitem-rejected-my-dspace-result-detail-element.component.scss'],
  templateUrl: './workspaceitem-rejected-my-dspace-result-detail-element.component.html',
})

@renderElementsFor(WorkspaceitemRejectedMyDSpaceResult, SetViewMode.Detail)
export class WorkspaceitemRejectedMyDSpaceResultDetailElementComponent extends MyDSpaceResultDetailElementComponent<WorkspaceitemRejectedMyDSpaceResult, WorkspaceItem> {

  item: Item;
  status = MyDspaceItemStatusType.REJECTED;

  ngOnInit() {
    this.initItem(this.dso.item as Observable<RemoteData<Item>>);
  }

  /**
   * Retrieve item from result object
   */
  initItem(item$: Observable<RemoteData<Item>>) {
    item$.pipe(
      find((rd: RemoteData<Item>) => rd.hasSucceeded && isNotUndefined(rd.payload))
    ).subscribe((rd: RemoteData<Item>) => {
      this.item = rd.payload;
    });
  }

}
