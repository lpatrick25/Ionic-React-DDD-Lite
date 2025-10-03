import { Component, OnInit } from '@angular/core';
import { AuthService, User } from 'src/app/core/services/auth.service';
import { SQLiteService } from '../../../infrastructure/services/SQLiteService';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.page.html',
  styleUrls: ['./profile-settings.page.scss'],
  standalone: false,
})
export class ProfileSettingsPage implements OnInit {
  user: User | null = null;

  constructor(private authService: AuthService, private sqliteService: SQLiteService) {}

  async ngOnInit() {
    this.user = this.authService.getCurrentUser();
    await this.sqliteService.initializeDatabase();
  }

  logout() {
    this.authService.logout();
  }
}
