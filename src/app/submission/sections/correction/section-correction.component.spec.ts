import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {mockSubmissionCollectionId, mockSubmissionId} from '../../../shared/mocks/mock-submission';
import {SectionCorrectionComponent} from './section-correction.component';
import {BrowserModule, By} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {SectionFormOperationsService} from "../form/section-form-operations.service";
import {getMockFormOperationsService} from "../../../shared/mocks/mock-form-operations-service";
import {FormService} from "../../../shared/form/form.service";
import {getMockFormService} from "../../../shared/mocks/mock-form-service";
import {ChangeDetectorRef, DebugElement} from "@angular/core";
import {FormBuilderService} from "../../../shared/form/builder/form-builder.service";
import {SubmissionSectionLicenseComponent} from "../license/section-license.component";
import {SectionDataObject} from "../models/section-data.model";
import {SectionsType} from "../sections-type";
import {CorrectionType} from "../../../core/submission/models/workspaceitem-correction.model";
import {SectionsServiceStub} from "../../../shared/testing/sections-service-stub";
import {SectionsService} from "../sections.service";


const sectionObject: SectionDataObject = {
  config: 'https://dspace7.4science.it/or2018/api/config/submissionforms/license',
  mandatory: true,
  data: [{
    operation: CorrectionType.MODIFIED,
    attributeName: 'dc.issued.date',
    oldValue: '2020-06-15',
    newValue: '2020-06-25',
    label: 'Date Of Issued'
  }],
  errors: [],
  header: 'submit.progressbar.describe.license',
  id: 'license',
  sectionType: SectionsType.License
};
const submissionId = mockSubmissionId;
const collectionId = mockSubmissionCollectionId;

describe('CorrectionComponent', () => {
  let component: SectionCorrectionComponent;
  let fixture: ComponentFixture<SectionCorrectionComponent>;
  let sectionsServiceStub: SectionsServiceStub;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot()
      ],
      declarations: [SectionCorrectionComponent],
      providers: [
        {provide: SectionFormOperationsService, useValue: getMockFormOperationsService()},
        {provide: FormService, useValue: getMockFormService()},
        {provide: SectionsService, useClass: SectionsServiceStub},
        {provide: 'collectionIdProvider', useValue: collectionId},
        {provide: 'sectionDataProvider', useValue: sectionObject},
        {provide: 'submissionIdProvider', useValue: submissionId},
        ChangeDetectorRef,
        FormBuilderService,
        SubmissionSectionLicenseComponent
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionCorrectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });



  it('should create correction component', () => {
    expect(component).toBeTruthy();
  });

  it('should contains a table with one row', () => {
    let tableElement: DebugElement = fixture.debugElement.query(By.css('.table'));
    const table = tableElement.nativeElement;
    expect(table.innerHTML).toBeDefined();
    let rows: DebugElement[] = tableElement.queryAll(By.css('.correction-row'));
    expect(rows.length).toEqual(1);
    let cells: DebugElement[] = rows[0].queryAll(By.css('td'));
    expect(cells.length).toEqual(3);
    expect(cells[0].nativeElement.innerHTML).toEqual('Date Of Issued');
    expect(cells[1].nativeElement.innerHTML).toEqual('2020-06-15');
    expect(cells[2].nativeElement.innerHTML).toEqual('2020-06-25');

  });
});
