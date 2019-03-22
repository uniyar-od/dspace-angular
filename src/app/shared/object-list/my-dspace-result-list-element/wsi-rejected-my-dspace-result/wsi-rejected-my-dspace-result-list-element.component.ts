import { Component } from '@angular/core';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { MyDSpaceResultListElementComponent, } from '../my-dspace-result-list-element.component';
import { ViewMode } from '../../../../+search-page/search-options.model';
import { Workspaceitem } from '../../../../core/submission/models/workspaceitem.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { hasNoUndefinedValue } from '../../../empty.util';
import { Item } from '../../../../core/shared/item.model';
import { ItemStatusType } from '../../../object-collection/shared/mydspace-item-status/item-status-type';
import { WorkspaceitemRejectedMyDSpaceResult } from '../../../object-collection/shared/workspaceitem-rejected-my-dspace-result.model';

@Component({
  selector: 'ds-workspaceitem-my-dspace-result-list-element',
  styleUrls: ['../my-dspace-result-list-element.component.scss', './wsi-rejected-my-dspace-result-list-element.component.scss'],
  templateUrl: './wsi-rejected-my-dspace-result-list-element.component.html',
})

@renderElementsFor(WorkspaceitemRejectedMyDSpaceResult, ViewMode.List)
export class WorkspaceitemRejectedMyDSpaceResultListElementComponent extends MyDSpaceResultListElementComponent<WorkspaceitemRejectedMyDSpaceResult, Workspaceitem> {

  item: Item;
  status = ItemStatusType.REJECTED;

  ngOnInit() {
    this.initItem(this.dso.item as Observable<RemoteData<Item[]>>);
  }

  initItem(itemObs: Observable<RemoteData<Item[]>>) {
    itemObs
      .filter((rd: RemoteData<any>) => ((!rd.isRequestPending) && hasNoUndefinedValue(rd.payload)))
      .take(1)
      .subscribe((rd: RemoteData<any>) => {
        this.item = rd.payload[0];
      });
  }

}
