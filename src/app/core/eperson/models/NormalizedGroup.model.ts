import { autoserialize, inheritSerialization } from 'cerialize';
import { CacheableObject } from '../../cache/object-cache.reducer';
import { ListableObject } from '../../../shared/object-collection/shared/listable-object.model';
import { NormalizedDSpaceObject } from '../../cache/models/normalized-dspace-object.model';
import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { Group } from './group.model';
import { ResourceType } from '../../shared/resource-type';

@mapsTo(Group)
@inheritSerialization(NormalizedDSpaceObject)
export class NormalizedGroupModel extends NormalizedDSpaceObject implements CacheableObject, ListableObject {

  @autoserialize
  public handle: string;

  /**
   * List of Groups that this EPerson belong to
   */
  @autoserialize
  @relationship(ResourceType.Group, true)
  groups: string[];

  @autoserialize
  public permanent: boolean;
}
