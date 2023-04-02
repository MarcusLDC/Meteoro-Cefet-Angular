import { Component, Inject} from '@angular/core';
import { AuthService } from '../app/shared/services/auth-services';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { LoginModalComponent } from './login-modal/login-modal.component';

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