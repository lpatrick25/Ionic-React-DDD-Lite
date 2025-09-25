import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

interface MenuItem {
  title: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: false,
})
export class MenuComponent {
  menuItems: MenuItem[] = [
    {
      title: 'Users',
      url: '/users',
      icon: 'people-outline',
    },
    {
      title: 'Consumers',
      url: '/consumers',
      icon: 'person-circle-outline',
    },
    {
      title: 'Meters',
      url: '/meters',
      icon: 'speedometer-outline',
    },
  ];

  constructor(private authService: AuthService) {}

  async onLogout() {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error('Logout failed', error);
    }
  }
}
