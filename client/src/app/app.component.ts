import { Component } from '@angular/core';
import { AuthService } from '../app/shared/services/auth-services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],

})

export class AppComponent {
  title = 'Meteoro Cefet';
  
  buttonMenu!: HTMLElement | null;
  divDropdown!: HTMLElement | null;
  logado: boolean = false;
  admin: boolean = false;
  constructor(private auth: AuthService){}

  async ngOnInit(): Promise<void> {
    this.buttonMenu = document.getElementById('buttonMenu');
    this.divDropdown = document.querySelector('.divDropdown');

    if (this.buttonMenu && this.divDropdown) {
      this.buttonMenu.addEventListener('click', () => {
        this.divDropdown!.classList.toggle('esconder');
      });
    }

    document.addEventListener('click', (event) => {
      const isClickedInside = this.divDropdown!.contains(event.target as Node) || this.buttonMenu!.contains(event.target as Node);
      if (!isClickedInside) {
        this.divDropdown!.classList.add('esconder');
      }
    });

    this.logado = await this.auth.isLogged();
    setInterval(async () => {
      this.logado = await this.auth.isLogged();
    }, 30000);

    this.admin = await this.auth.isAdmin();
    setInterval(async () => {
      this.admin = await this.auth.isAdmin();
    }, 30000);
  }
} 