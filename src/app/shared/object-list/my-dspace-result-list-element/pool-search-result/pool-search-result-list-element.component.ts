import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { find, take } from 'rxjs/operators';

import { ViewMode } from '../../../../core/shared/view-mode.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { isNotUndefined } from '../../../empty.util';
import { WorkflowItem } from '../../../../core/submission/models/workflowitem.model';
import { PoolTask } from '../../../../core/tasks/models/pool-task-object.model';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { PoolTaskSearchResult } from '../../../object-collection/shared/pool-task-search-result.model';
import { SearchResultListElementComponent } from '../../search-result-list-element/search-result-list-element.component';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { MYDSPACE_ROUTE } from '../../../../+my-dspace-page/my-dspace-page.component';

/**
 * This component renders pool task object for the search result in the list view.
 */
@Component({
  selector: 'ds-pool-search-result-list-element',
  styleUrls: ['../../search-result-list-element/search-result-list-element.component.scss'],
  templateUrl: './pool-search-result-list-element.component.html',
})

@listableObjectComponent(PoolTaskSearchResult, ViewMode.ListElement)
export class PoolSearchResultListElementComponent extends SearchResultListElementComponent<PoolTaskSearchResult, PoolTask> implements OnInit {

  /**
   * A boolean representing if to show submitter information
   */
  public showSubmitter = true;

  /**
   * Represent item's status
   */
  public status = MyDspaceItemStatusType.WAITING_CONTROLLER;

  /**
   * The workflowitem object that belonging to the result object
   */
  public workflowitem: WorkflowItem;

  /**
   * The index of this list element
   */
  public index: number;

  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected truncatableService: TruncatableService) {
    super(truncatableService);
  }

  /**
   * Initialize all instance variables
   */
  ngOnInit() {
    super.ngOnInit();
    this.initWorkflowItem(this.dso.workflowitem as Observable<RemoteData<WorkflowItem>>);
  }

  /**
   * Retrieve workflowitem from result object
   */
  initWorkflowItem(wfi$: Observable<RemoteData<WorkflowItem>>) {
    this.subs.push(
      wfi$.pipe(
        find((rd: RemoteData<WorkflowItem>) => (rd.hasSucceeded && isNotUndefined(rd.payload)))
      ).subscribe((rd: RemoteData<WorkflowItem>) => {
        this.workflowitem = rd.payload;
      })
    );
  }

  view() {
    this.subs.push(
      this.route.queryParams.pipe(
        take(1))
        .subscribe((params) => {
          const pageSize = 1;
          const queryPageSize = params.pageSize || 1;
          const queryPage = params.page || 1;
          const page = ((queryPage - 1) * queryPageSize) + (this.dsoIndex + 1);

          const navigationExtras: NavigationExtras = {
            queryParams: {
              view: ViewMode.DetailedListElement,
              page,
              pageSize
            },
            queryParamsHandling: 'merge'
          };
          this.router.navigate([MYDSPACE_ROUTE], navigationExtras);
        })
      );
  }

}
