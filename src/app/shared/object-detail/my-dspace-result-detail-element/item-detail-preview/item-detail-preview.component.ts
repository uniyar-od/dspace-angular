import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { Item } from '../../../../core/shared/item.model';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { fadeInOut } from '../../../animations/fade';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { FileService } from '../../../../core/shared/file.service';
import { HALEndpointService } from '../../../../core/shared/hal-endpoint.service';
import { SearchResult } from '../../../search/search-result.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { SubmissionObject } from '../../../../core/submission/models/submission-object.model';
import { createSuccessfulRemoteDataObject$ } from '../../../testing/utils';

/**
 * This component show metadata for the given item object in the detail view.
 */
@Component({
  selector: 'ds-item-detail-preview',
  styleUrls: ['./item-detail-preview.component.scss'],
  templateUrl: './item-detail-preview.component.html',
  animations: [fadeInOut]
})
export class ItemDetailPreviewComponent {

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
   * The item's thumbnail
   */
  public bitstreams$: Observable<Bitstream[]>;

  /**
   * The value's separator
   */
  public separator = ', ';

  /**
   * The item's thumbnail
   */
  public thumbnail$: Observable<Bitstream>;

  /**
   * Initialize instance variables
   *
   * @param {FileService} fileService
   * @param {HALEndpointService} halService
   */
  constructor(private fileService: FileService,
              private halService: HALEndpointService) {
  }

  /**
   * Initialize all instance variables
   */
  ngOnInit() {
    this.thumbnail$ = this.item.getThumbnail();
    this.bitstreams$ = this.item.getFiles();
  }

  /**
   * Perform bitstream download
   */
  public downloadBitstreamFile(uuid: string) {
    this.halService.getEndpoint('bitstreams').pipe(
      first())
      .subscribe((url) => {
        const fileUrl = `${url}/${uuid}/content`;
        this.fileService.downloadFile(fileUrl);
      });
  }

  /**
   * Return submission object
   */
  getSubmissionObject(): Observable<RemoteData<SubmissionObject>> {
    if (this.isWorkspaceItem) {
      createSuccessfulRemoteDataObject$(this.object.indexableObject);
    } else {
      return this.object.indexableObject.workflowitem
    }
  }
}
