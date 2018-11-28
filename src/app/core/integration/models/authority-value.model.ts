import { IntegrationModel } from './integration.model';
import { autoserialize } from 'cerialize';
import { isNotEmpty } from '../../../shared/empty.util';

export class AuthorityValueModel extends IntegrationModel {

  @autoserialize
  id: string;

  @autoserialize
  display: string;

  @autoserialize
  value: string;

  @autoserialize
  otherInformation: any;

  @autoserialize
  language: string;

  hasAuthority(): boolean {
    return isNotEmpty(this.id);
  }

  hasValue(): boolean {
    return isNotEmpty(this.value);
  }

  hasOtherInformation(): boolean {
    return isNotEmpty(this.otherInformation);
  }
}
