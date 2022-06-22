import { Component, OnInit } from '@angular/core';
import { DataGraphService } from './services/data-graph.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  initGraph: boolean = false;

  constructor(public dataGraphService: DataGraphService) { }

  ngOnInit(): void { }

  onReady() {
    this.initGraph = true;
  }
}
