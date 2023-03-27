import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],

})

export class AppComponent {
  title = 'Meteoro Cefet';
  
  buttonMenu!: HTMLElement | null;
  divDropdown!: HTMLElement | null;

  ngOnInit(): void {
    this.buttonMenu = document.getElementById('buttonMenu');
    this.divDropdown = document.querySelector('.divDropdown');

    if (this.buttonMenu && this.divDropdown) {
      this.buttonMenu.addEventListener('click', () => {
        this.divDropdown!.classList.toggle('esconder');
      });
    }
  }
} 