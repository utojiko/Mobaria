import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { WikiSidebarComponent } from './components/wiki-sidebar/wiki-sidebar.component';

@Component({
  selector: 'app-wiki',
  standalone: true,
  imports: [CommonModule, RouterOutlet, WikiSidebarComponent],
  templateUrl: './wiki.component.html',
  styleUrl: './wiki.component.scss'
})
export class WikiComponent implements OnInit {
  isSidebarOpen = true;
  
  ngOnInit() {
    this.checkWindowSize();
    window.addEventListener('resize', this.checkWindowSize.bind(this));
  }
  
  checkWindowSize() {
    this.isSidebarOpen = window.innerWidth > 768;
  }
  
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}