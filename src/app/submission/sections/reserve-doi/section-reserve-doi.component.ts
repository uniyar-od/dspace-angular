import { ChangeDetectorRef, Component, Inject } from '@angular/core';

import { Observable, of as observableOf, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { SectionModelComponent } from '../models/section.model';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { hasValue, isNotEmpty } from '../../../shared/empty.util';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { SectionsType } from '../sections-type';
import { renderSectionFor } from '../sections-decorator';
import { SectionDataObject } from '../models/section-data.model';
import { SubmissionService } from '../../submission.service';
import { SectionsService } from '../sections.service';
import { WorkspaceitemSectionReserveDoiObject } from '../../../core/submission/models/workspaceitem-section-reserve-doi.model';
import { RoleType } from '../../../core/roles/role-types';
import { SubmissionScopeType } from '../../../core/submission/submission-scope-type';

/**
 * This component represents a section that contains the submission license form.
 */
@Component({
  selector: 'ds-submission-reserve-doi-license',
  styleUrls: ['./section-reserve-doi.component.scss'],
  templateUrl: './section-reserve-doi.component.html',
})
@renderSectionFor(SectionsType.ReserveDoi)
export class SubmissionSectionReserveDoiComponent extends SectionModelComponent {

  /**
   * A boolean representing if object is workspaceitem or workflowitem
   */
  public isWorkspaceItem: boolean;

  /**
   * Variable for enumeration RoleType
   */
  public roleTypeEnum = RoleType;

  /**
   * The [[JsonPatchOperationPathCombiner]] object
   * @type {JsonPatchOperationPathCombiner}
   */
  private pathCombiner: JsonPatchOperationPathCombiner;

  /**
   * The reserved doi
   * @type Observable<string>
   */
  private reservedDoi$: Observable<string>;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  private subs: Subscription[] = [];

  /**
   * Initialize instance variables
   *
   * @param {ChangeDetectorRef} changeDetectorRef
   * @param {JsonPatchOperationsBuilder} operationsBuilder
   * @param {SectionsService} sectionService
   * @param {SubmissionService} submissionService
   * @param {TranslateService} translate
   * @param {string} injectedCollectionId
   * @param {SectionDataObject} injectedSectionData
   * @param {string} injectedSubmissionId
   */
  constructor(protected changeDetectorRef: ChangeDetectorRef,
              protected operationsBuilder: JsonPatchOperationsBuilder,
              protected sectionService: SectionsService,
              protected submissionService: SubmissionService,
              protected translate: TranslateService,
              @Inject('collectionIdProvider') public injectedCollectionId: string,
              @Inject('sectionDataProvider') public injectedSectionData: SectionDataObject,
              @Inject('submissionIdProvider') public injectedSubmissionId: string) {
    super(injectedCollectionId, injectedSectionData, injectedSubmissionId);
  }

  /**
   * Initialize all instance variables and retrieve submission license
   */
  onSectionInit() {
    this.isWorkspaceItem = this.submissionService.getSubmissionScope() === SubmissionScopeType.WorkspaceItem;
    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionData.id);
    this.reservedDoi$ = this.sectionService.getSectionData(this.submissionId, this.sectionData.id, SectionsType.ReserveDoi).pipe(
      map((sectionData: WorkspaceitemSectionReserveDoiObject) => isNotEmpty(sectionData) ? sectionData.doi : null),
      take(1)
    );
  }

  /**
   * Emit a boolean representing if there is a reserved doi
   *
   * @return Observable<boolean>
   */
  public hasReservedDoi(): Observable<boolean> {
    return this.reservedDoi$.pipe(
      map((doi: string) => isNotEmpty(doi))
    );
  }

  /**
   * Emit a message with the reserved doi
   *
   * @return Observable<boolean>
   */
  public getReservedDoiMessage(): Observable<string> {
    return this.reservedDoi$.pipe(
      map((doi: string) => this.translate.instant('submission.sections.reserve-doi.reserved', { doi }))
    );
  }

  /**
   * Update doi
   */
  public updateDoi(doi: string) {
    this.reservedDoi$ = observableOf(doi);
  }

  /**
   * Get section status
   *
   * @return Observable<boolean>
   *     the section status
   */
  protected getSectionStatus(): Observable<boolean> {
    return observableOf(true);
  }

  /**
   * Unsubscribe from all subscriptions
   */
  onSectionDestroy() {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

}
