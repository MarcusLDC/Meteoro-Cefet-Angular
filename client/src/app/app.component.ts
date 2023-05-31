import { Component} from '@angular/core';
import { AuthService } from '../app/shared/services/auth-services';
import { MatDialog } from '@angular/material/dialog';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],

})

export class AppComponent {
  title = 'Meteoro Cefet';
  
  modalAberto = false;
  logado: boolean = false;
  admin: boolean = false;

  constructor(private auth: AuthService, public dialog: MatDialog, private router: Router){}

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