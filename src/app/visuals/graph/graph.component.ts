import { Component, ChangeDetectorRef, HostListener, ChangeDetectionStrategy, OnInit, Injectable } from '@angular/core';
import { D3Service, ForceDirectedGraph, Link, Node } from '../../d3';
import { DataGraphService } from 'src/app/services/data-graph.service';
import { DbPediaService } from 'src/app/services/dbpedia.service';

@Component({
  selector: 'graph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
@Injectable(
  {
    providedIn: 'root'
  }
)
export class GraphComponent implements OnInit {
  nodes: Node[];
  links: Link[];
  graph: ForceDirectedGraph;
  _options: { width, height } = { width: window.innerWidth, height: window.innerHeight };

  loading: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.graph.initSimulation(this.options);
  }

  constructor(private d3Service: D3Service,
    private ref: ChangeDetectorRef,
    private dataGraphService: DataGraphService,
    private dbPediaService: DbPediaService) { }

  ngOnInit() { 
    this.nodes = this.dataGraphService.nodes;
    this.links = this.dataGraphService.links;

    this.initializeGraph();

    this.dataGraphService.getRefreshGraph$().subscribe(
      () => {
        this.graph.initNodes();
        this.graph.initLinks();
      }
    );

    this.dbPediaService.getLoading$().subscribe(
      (isLoading: boolean) => {
        this.loading = isLoading;
      }
    )
  }

  get options() {
    return this._options = {
      width:  this._options.width,
      height: this._options.height
    };
  }

  initializeGraph() {
    this.graph = this.d3Service.getForceDirectedGraph(this.nodes, this.links, this.options);

    this.graph.ticker.subscribe((d) => {
      this.ref.markForCheck();
    });
  }
}
