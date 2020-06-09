import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { BehaviorSubject, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { SubmissionJsonPatchOperationsService } from '../../../core/submission/submission-json-patch-operations.service';
import { hasValue, isNotEmpty, isNotNull } from '../../empty.util';
import { WorkspaceitemSectionReserveDoiObject } from '../../../core/submission/models/workspaceitem-section-reserve-doi.model';
import { NotificationsService } from '../../notifications/notifications.service';

/**
 * This component represents actions related to WorkspaceItem object.
 */
@Component({
  selector: 'ds-reserve-doi-actions',
  styleUrls: ['./reserve-doi-actions.component.scss'],
  templateUrl: './reserve-doi-actions.component.html',
})
export class ReserveDoiActionsComponent implements OnInit, OnDestroy {

  /**
   * A boolean representing if object is workspaceitem or workflowitem
   */
  @Input() isWorkspaceItem = true;

  /**
   * The object id
   */
  @Input() objectId: string;

  /**
   * The workspaceitem object
   */
  @Input() sectionData: WorkspaceitemSectionReserveDoiObject;

  /**
   * EventEmitter to return the reserved doi
   * @type {EventEmitter<string[]>}
   */
  @Output() reserve: EventEmitter<string> = new EventEmitter<string>();

  /**
   * A boolean representing if there is a reserved doi
   * @type boolean
   */
  public hasReservedDoi = false;

  /**
   * A boolean representing if a delete operation is pending
   * @type {BehaviorSubject<boolean>}
   */
  public processing$ = new BehaviorSubject<boolean>(false);

  /**
   * The [[JsonPatchOperationPathCombiner]] object
   * @type {JsonPatchOperationPathCombiner}
   */
  protected pathCombiner: JsonPatchOperationPathCombiner;

  /**
   * Variable to track subscription and unsubscribe it onDestroy
   */
  protected sub: Subscription;

  /**
   * Initialize instance variables
   *
   * @param {FormBuilder} formBuilder
   * @param {NgbModal} modalService
   * @param {NotificationsService} notificationService
   * @param {JsonPatchOperationsBuilder} operationsBuilder
   * @param {SubmissionJsonPatchOperationsService} operationsService
   * @param {TranslateService} translate
   */
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private notificationService: NotificationsService,
    private operationsBuilder: JsonPatchOperationsBuilder,
    private operationsService: SubmissionJsonPatchOperationsService,
    private translate: TranslateService
  ) {
  }

  /**
   * Initialize objects
   */
  ngOnInit() {
    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', 'reserve-doi');
    this.hasReservedDoi = isNotEmpty(this.sectionData) && isNotEmpty(this.sectionData.doi);
  }

  /**
   * Reserve a doi
   */
  public reserveDoi() {
    this.processing$.next(true);
    this.operationsBuilder.add(this.pathCombiner.getPath(), true, false, true);
    this.sub = this.operationsService.jsonPatchByResourceID(
      this.isWorkspaceItem ? 'workspaceitems' : 'workflowitems',
      this.objectId,
      'sections',
      'reserve-doi')
      .pipe(
        take(1),
        map((result: any[]) => {
          if (result[0] && result[0].sections && result[0].sections['reserve-doi']) {
            return result[0].sections['reserve-doi'].doi;
          } else {
            return null;
          }
        }),
        catchError(() => observableOf(null))
      )
      .subscribe((doi: string) => {
        this.processing$.next(false);
        if (isNotNull(doi)) {
          this.hasReservedDoi = true;
          this.reserve.emit(doi);
          this.notificationService.success(null, this.translate.get('submission.sections.reserve-doi.confirm.success_notice'));
        } else {
          this.notificationService.error(null, this.translate.get('submission.sections.reserve-doi.confirm.error_notice'));
        }
      })
  }

  /**
   * Dispatch reserve doi method
   */
  public confirmOperation(content) {
    this.modalService.open(content).result.then(
      (result) => {
        if (result === 'ok') {
          this.reserveDoi();
        }
      }
    );
  }

  /**
   * Make sure the subscription is unsubscribed from when this component is destroyed
   */
  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }

}
