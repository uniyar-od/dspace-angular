import { Component, Input } from '@angular/core';

import { Item } from '../../../../core/shared/item.model';
import { fadeInOut } from '../../../animations/fade';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { SearchResult } from '../../../search/search-result.model';
import { DuplicateMatchMetadataDetailConfig } from '../../../../submission/sections/detect-duplicate/models/duplicate-detail-metadata.model';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../../../../core/data/remote-data';
import { SubmissionObject } from '../../../../core/submission/models/submission-object.model';
import { createSuccessfulRemoteDataObject$ } from '../../../testing/utils';

/**
 * This component show metadata for the given item object in the list view.
 */
@Component({
  selector: 'ds-item-list-preview',
  styleUrls: ['item-list-preview.component.scss'],
  templateUrl: 'item-list-preview.component.html',
  animations: [fadeInOut]
})
export class ItemListPreviewComponent {

  /**
   * A boolean representing if object is workspaceitem or workflowitem
   */
  @Input() isWorkspaceItem = true;

  /**
   * The item to display
   */
  @Input() item: Item;

  /**
   * The search result object
   */
  @Input() object: SearchResult<any>;

  /**
   * Represent item's status
   */
  @Input() status: MyDspaceItemStatusType;

  /**
   * A boolean representing if to show submitter information
   */
  @Input() showSubmitter = false;

  /**
   * An object representing the duplicate match
   */
  @Input() metadataList: DuplicateMatchMetadataDetailConfig[] = [];
  /**
   * A boolean representing if to show is correction information
   */
  @Input() showIsCorrection = false;

  /**
   * Return submission object
   */
  getSubmissionObject(): Observable<RemoteData<SubmissionObject>> {
    if (this.isWorkspaceItem) {
      return createSuccessfulRemoteDataObject$(this.object.indexableObject);
    } else {
      return this.object.indexableObject.workflowitem
    }
  }
}
