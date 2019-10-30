import { autoserialize, autoserializeAs, inheritSerialization } from 'cerialize';
import { MetadataMap } from '../core/shared/metadata.models';
import { ListableObject } from '../shared/object-collection/shared/listable-object.model';
import { NormalizedObject } from '../core/cache/models/normalized-object.model';

/**
 * Represents a normalized version of a search result object of a certain DSpaceObject
 */
@inheritSerialization(NormalizedObject)
export class NormalizedSearchResult implements ListableObject {
  /**
   * The UUID of the DSpaceObject that was found
   */
  @autoserializeAs(String, 'rObject')
  indexableObject: string;

  /**
   * The metadata that was used to find this item, hithighlighted
   */
  @autoserialize
  hitHighlights: MetadataMap;

}
