import { Component} from '@angular/core';
import { AuthService } from '../app/shared/services/auth-services';
import { MatDialog } from '@angular/material/dialog';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { LoginDialog } from './shared/services/Dialogs/login-dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],

})

export class AppComponent {
  title = 'Meteoro Cefet';
  
  modalAberto = false;
  buttonMenu!: HTMLElement | null;
  divDropdown!: HTMLElement | null;
  logado: boolean = false;
  admin: boolean = false;

  constructor(private auth: AuthService, private dialogService: LoginDialog, public dialog: MatDialog){}

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

  openDialog() {
    if(this.modalAberto)
      return;

    var dialogRef = this.dialog.open(LoginModalComponent, {
      width: '300px',
      data: { name: 'Angular' }
    });

    this.modalAberto = true;

    dialogRef.afterClosed().subscribe(() => {
      this.modalAberto = false;
    });
  }

  public async sair(){
    this.auth.logout();
  }
} 