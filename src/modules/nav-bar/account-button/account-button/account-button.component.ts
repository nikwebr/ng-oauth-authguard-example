import {Component, Input, OnInit} from '@angular/core';
import {AuthNService, UserProfile} from "../../../../core/auth-n/auth-n.service";

@Component({
  selector: 'app-account-button',
  templateUrl: './account-button.component.html',
  styleUrl: './account-button.component.scss'
})
export class AccountButtonComponent implements OnInit {
  protected userProfile: UserProfile | undefined | null;

  constructor() {
  }

  @Input() authNService!: AuthNService;

  async ngOnInit() {
    this.userProfile = await this.authNService.getUserProfile();

  }

  protected async onLogoutButtonClick() {
    this.authNService.logout();
  }

  protected onAccountButtonClick() {
    this.authNService.openAccountManager();
  }
}
