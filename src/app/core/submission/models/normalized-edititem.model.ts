import { autoserialize, inheritSerialization } from 'cerialize';
import { mapsTo, relationship } from '../../cache/builders/build-decorators';
import { NormalizedWorkspaceItem } from './normalized-workspaceitem.model';
import { NormalizedSubmissionObject } from './normalized-submission-object.model';
import { ResourceType } from '../../shared/resource-type';
import { EditItem } from './edititem.model';
import { Workflowitem } from './workflowitem.model';

@mapsTo(EditItem)
@inheritSerialization(NormalizedWorkspaceItem)
export class NormalizedEditItem extends NormalizedSubmissionObject<Workflowitem> {

  /**
   * The collection this workspaceitem belonging to
   */
  @autoserialize
  @relationship(ResourceType.Collection, false)
  collection: string;

  /**
   * The item created with this workspaceitem
   */
  @autoserialize
  @relationship(ResourceType.Item, false)
  item: string;

  /**
   * The configuration object that define this workspaceitem
   */
  @autoserialize
  @relationship(ResourceType.SubmissionDefinition, false)
  submissionDefinition: string;

  /**
   * The EPerson who submit this workspaceitem
   */
  @autoserialize
  @relationship(ResourceType.EPerson, false)
  submitter: string;
}
