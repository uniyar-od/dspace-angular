import { FormFieldModel } from '../models/form-field.model';
import { ConcatFieldParser } from './concat-field-parser';
import { ParserOptions } from './parser-options';
import { TranslateService } from '@ngx-translate/core';

export class SeriesFieldParser extends ConcatFieldParser {

  constructor(protected translate: TranslateService, protected configData: FormFieldModel, protected initFormValues, protected parserOptions: ParserOptions) {
    super(translate, configData, initFormValues, parserOptions, ';');
  }
}
