import { Config } from './config.interface';
import { MetadataIconsConfig } from '../app/shared/chips/models/chips.model';
import { DuplicateMatchMetadataDetailConfig } from '../app/submission/sections/detect-duplicate/models/duplicate-detail-metadata.model';

interface AutosaveConfig extends Config {
  metadata: string[],
  timer: number
}

interface MetadataConfig extends Config {
  icons: MetadataIconsConfig[]
}

interface DetectDuplicateConfig extends Config {
  metadataDetailsList: DuplicateMatchMetadataDetailConfig[]
}

export interface SubmissionConfig extends Config {
  autosave: AutosaveConfig,
  metadata: MetadataConfig,
  detectDuplicate: DetectDuplicateConfig
}
