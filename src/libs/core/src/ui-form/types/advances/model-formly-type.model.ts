import { FieldType } from "@ngx-formly/core";
import {AbstractControl} from "@angular/forms";
import {getKeyPath} from "@ngx-formly/core/lib/utils";

export abstract class ModelFormlyFieldConfig<F, G> extends FieldType<G> {
   subModel: F;
   public get path(): string{
     // @ts-ignore
     return this.getControlPath(this.formControl,'');
   }

  private getControlName(c: AbstractControl): string | null {
    if(!c.parent) return null;
    const formGroup = c.parent.controls;
    return Object.keys(formGroup).find(name => c === formGroup[name]) || null;
  }

  private getControlPath(c: AbstractControl, path: string): string | null {
    path = this.getControlName(c) + path;

    if(c.parent && this.getControlName(c.parent)) {
      path = "."+path;
      return this.getControlPath(c.parent, path);
    } else {
      return path;
    }
  }
}
