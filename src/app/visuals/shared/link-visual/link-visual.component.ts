import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { Link } from '../../../d3';
import { DataGraphService } from 'src/app/services/data-graph.service';

@Component({
  selector: '[linkVisual]',
  templateUrl: './link-visual.component.html',
  styleUrls: ['./link-visual.component.css']
})
export class LinkVisualComponent implements OnInit {
  @Input('linkVisual') link: Link;

  constructor() { }

  ngOnInit(): void {

  }

  getXPositionName(): number {
    return (this.link.target.x + this.link.source.x)/2;
  }

  getYPositionName(): number {
    return (this.link.target.y + this.link.source.y)/2;
  }

  showLink(): boolean {
    return !this.link.source.hidden && !this.link.target.hidden;
  }
}
