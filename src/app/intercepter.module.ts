import {ModuleWithProviders, NgModule} from "@angular/core";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ApiResponseInterceptor} from "./core";
import {TokenInterceptor} from "./core/interceptors/token.interceptor";

@NgModule({
  imports: [
    HttpClientModule
  ]
})
export class InterceptorModule {

  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: InterceptorModule,
      providers: [
        {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
        { provide: HTTP_INTERCEPTORS, useClass: ApiResponseInterceptor, multi: true }
      ]
    };
  }
}
