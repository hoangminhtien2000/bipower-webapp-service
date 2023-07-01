import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { OauthService } from "../../core/services/oauth.service";

@Component({
  selector: 'spinner-component',
  styleUrls: [`./spinner.component.scss`],
  templateUrl: `./spinner.component.html`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent implements OnInit {
  constructor(public oauthService: OauthService) { }
  ngOnInit(): void {
  }
}
