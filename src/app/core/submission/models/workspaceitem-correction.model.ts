/**
 * An interface to represent submission's reserve-doi section data.
 */
export enum CorrectionType {
  ADDED='ADDED',
  REMOVED='REMOVED',
  MODIFIED='MODIFIED',

}
export interface WorkspaceitemCorrectionObject {

  operation: CorrectionType;
  attributeName: string;
  oldValue: string;
  newValue: string;
  label: string;
}
