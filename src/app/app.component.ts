import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private platform: Platform) {
    if (Capacitor.isNativePlatform()) {
      this.initializeApp();
    }
  }

  async initializeApp() {
    try {
      await StatusBar.setOverlaysWebView({ overlay: false });
      await StatusBar.setBackgroundColor({ color: '#2196f3' }); // Material Blue
    } catch (error) {
      console.error('StatusBar initialization failed:', error);
      await StatusBar.setBackgroundColor({ color: '#1565c0' }).catch(() => { }); // fallback
    }
  }
}
