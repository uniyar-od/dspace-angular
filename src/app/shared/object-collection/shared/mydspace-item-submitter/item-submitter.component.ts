import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { filter, find, map, mergeMap } from 'rxjs/operators';

import { EPerson } from '../../../../core/eperson/models/eperson.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { isNotEmpty, isNotUndefined } from '../../../empty.util';
import { SubmissionObject } from '../../../../core/submission/models/submission-object.model';

/**
 * This component represents a badge with submitter information.
 */
@Component({
  selector: 'ds-item-submitter',
  styleUrls: ['./item-submitter.component.scss'],
  templateUrl: './item-submitter.component.html'
})
export class ItemSubmitterComponent implements OnInit {

  /**
   * The target object
   */
  @Input() object: Observable<RemoteData<SubmissionObject>>;

  /**
   * The Eperson object
   */
  submitter$: Observable<EPerson>;

  /**
   * Initialize submitter object
   */
  ngOnInit() {
    this.submitter$ = this.object.pipe(
      filter((rd: RemoteData<SubmissionObject>) => (rd.hasSucceeded && isNotUndefined(rd.payload))),
      mergeMap((rd: RemoteData<SubmissionObject>) => rd.payload.submitter as Observable<RemoteData<EPerson>>),
      find((rd: RemoteData<EPerson>) => rd.hasSucceeded && isNotEmpty(rd.payload)),
      map((rd: RemoteData<EPerson>) => rd.payload));
  }
}
