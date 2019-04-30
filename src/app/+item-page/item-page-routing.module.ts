import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ItemPageComponent } from './simple/item-page.component';
import { FullItemPageComponent } from './full/full-item-page.component';
import { ItemPageResolver } from './item-page.resolver';
import { URLCombiner } from '../core/url-combiner/url-combiner';
import { getItemModulePath } from '../app-routing.module';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { SubmissionEditComponent } from '../submission/edit/submission-edit.component';

export function getItemPageRoute(itemId: string) {
  return new URLCombiner(getItemModulePath(), itemId).toString();
}
export function getItemEditPath(id: string) {
  return new URLCombiner(getItemModulePath(),ITEM_EDIT_PATH.replace(/:id/, id)).toString()
}

const ITEM_EDIT_PATH = ':id/edit';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':id',
        component: ItemPageComponent,
        pathMatch: 'full',
        resolve: {
          item: ItemPageResolver
        }
      },
      {
        path: ':id/full',
        component: FullItemPageComponent,
        resolve: {
          item: ItemPageResolver
        }
      },
      {
        canActivate: [AuthenticatedGuard],
        path: ':id/edit',
        component: SubmissionEditComponent,
        data: { title: 'submission.edit.title' }
      },
    ])
  ],
  providers: [
    ItemPageResolver,
  ]
})
export class ItemPageRoutingModule {

}
