import {NgModule} from "@angular/core";
import {FormlyModule} from "@ngx-formly/core";
import {TranslateModule} from "@ngx-translate/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TextFormlyTypeComponent} from "@vt88/core/src/ui-form/types/text-formly-type/text-formly-type.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FormlyModule.forRoot({
            types: [
                {name: 'text', component: TextFormlyTypeComponent},
            ],
        }),
        TranslateModule
    ],
    declarations: [
      TextFormlyTypeComponent
    ],
    exports: [
        TextFormlyTypeComponent
    ], providers: []
})
export class TextFormlyModule {
}
