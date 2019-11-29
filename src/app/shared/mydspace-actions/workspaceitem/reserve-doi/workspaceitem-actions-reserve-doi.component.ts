import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { BehaviorSubject, of as observableOf, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { JsonPatchOperationPathCombiner } from '../../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { WorkspaceItem } from '../../../../core/submission/models/workspaceitem.model';
import { JsonPatchOperationsBuilder } from '../../../../core/json-patch/builder/json-patch-operations-builder';
import { SubmissionJsonPatchOperationsService } from '../../../../core/submission/submission-json-patch-operations.service';
import { hasValue, isNotEmpty } from '../../../empty.util';
import { WorkspaceitemSectionReserveDoiObject } from '../../../../core/submission/models/workspaceitem-section-reserve-doi.model';
import { NotificationsService } from '../../../notifications/notifications.service';
import { catchError, map, take } from 'rxjs/operators';

/**
 * This component represents actions related to WorkspaceItem object.
 */
@Component({
  selector: 'ds-workspaceitem-actions-reserve-doi',
  styleUrls: ['./workspaceitem-actions-reserve-doi.component.scss'],
  templateUrl: './workspaceitem-actions-reserve-doi.component.html',
})
export class WorkspaceitemActionsReserveDoiComponent implements OnInit, OnDestroy {

  /**
   * The workspaceitem object
   */
  @Input() object: WorkspaceItem;

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
    const sectionData: WorkspaceitemSectionReserveDoiObject = this.object.sections['reserve-doi'] as any;
    this.hasReservedDoi = isNotEmpty(sectionData) && isNotEmpty(sectionData.doi);
  }

  /**
   * Reserve a doi
   */
  public reserveDoi() {
    this.processing$.next(true);
    this.operationsBuilder.add(this.pathCombiner.getPath(), true, false, true);
    this.sub = this.operationsService.jsonPatchByResourceID(
      'workspaceitems',
      this.object.id,
      'sections',
      'reserve-doi')
      .pipe(
        take(1),
        map((result) => isNotEmpty(result)),
        catchError(() => observableOf(false))
      )
      .subscribe((result: boolean) => {
        this.processing$.next(false);
        if (result === true) {
          this.hasReservedDoi = true;
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

  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }

}
