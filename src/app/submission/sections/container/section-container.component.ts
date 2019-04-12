import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';

import { SectionsDirective } from '../sections.directive';
import { SectionDataObject } from '../models/section-data.model';
import { rendersSectionType } from '../sections-decorator';
import { SectionsType } from '../sections-type';
import { AlertType } from '../../../shared/alerts/aletrs-type';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'ds-submission-form-section-container',
  templateUrl: './section-container.component.html',
  styleUrls: ['./section-container.component.scss'],
})
export class SectionContainerComponent implements OnInit {
  @Input() collectionId: string;
  @Input() sectionData: SectionDataObject;
  @Input() submissionId: string;

  public AlertTypeEnum = AlertType;
  public active = true;
  public isRemoving: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public objectInjector: Injector;
  public sectionComponentType: SectionsType;

  protected pathCombiner: JsonPatchOperationPathCombiner;

  @ViewChild('sectionRef') sectionRef: SectionsDirective;

  constructor(private injector: Injector, private operationsBuilder: JsonPatchOperationsBuilder) {
  }

  ngOnInit() {
    this.objectInjector = Injector.create({
      providers: [
        {provide: 'collectionIdProvider', useFactory: () => (this.collectionId), deps: []},
        {provide: 'sectionDataProvider', useFactory: () => (this.sectionData), deps: []},
        {provide: 'submissionIdProvider', useFactory: () => (this.submissionId), deps: []},
      ],
      parent: this.injector
    });
    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', this.sectionData.id);
  }

  public removeSection(event) {
    event.preventDefault();
    event.stopPropagation();

    this.isRemoving.next(true);
    this.operationsBuilder.remove(this.pathCombiner.getPath());
    this.sectionRef.removeSection(this.submissionId, this.sectionData.id);
  }

  getSectionContent(): string {
    return rendersSectionType(this.sectionData.sectionType);
  }
}
