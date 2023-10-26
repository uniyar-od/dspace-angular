import { Component, Inject, OnInit } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { BitstreamDataService } from '../../../../../../../core/data/bitstream-data.service';
import { Bitstream } from '../../../../../../../core/shared/bitstream.model';

import { BitstreamRenderingModelComponent } from '../bitstream-rendering-model';

import { Item } from '../../../../../../../core/shared/item.model';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';
import { PaginatedList } from '../../../../../../../core/data/paginated-list.model';


@Component({
  selector: 'ds-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
@MetadataBoxFieldRendering(FieldRenderingType.VIDEO, true)
export class VideoComponent extends BitstreamRenderingModelComponent implements OnInit {
  videoLinks: string[] = [];
  currentIndex = 0;
  initialized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    protected bitstreamDataService: BitstreamDataService,
    protected translateService: TranslateService
  ) {
    super(fieldProvider, itemProvider, renderingSubTypeProvider, bitstreamDataService, translateService);
  }

  ngOnInit(): void {
    this.getBitstreamsByItem().pipe(
      map((bitstreamList: PaginatedList<Bitstream>) => bitstreamList.page),
      map((bitstreams: Bitstream[]) => {
        let links: string[] = [];
        bitstreams.forEach(bitstream => {
          if (this.fileName(bitstream).toLowerCase().slice(-4) === '.mp4') {
            links.push(this.getLink(bitstream));
          }
          })
        return links
        })
    ).subscribe((links: string[]) => {
      if (links.length > 0) {
        this.videoLinks = links; 
      }
      this.initialized.next(true);
    })
  }

  nextMedia() {
    this.currentIndex++;
  }

  prevMedia() {
    this.currentIndex--;
  }
}