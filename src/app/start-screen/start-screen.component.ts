import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DbPediaService } from '../services/dbpedia.service';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.css']
})
export class StartScreenComponent implements OnInit {

  @Output() ready = new EventEmitter<boolean>();

  value: string;
  concepts: Map<string, string> = null;

  events: string[] = [];
  opened: boolean = true;
  endpoints: string[] = ['https://dbpedia.org/sparql'];
  endpointSelected: string;
  languages: string[] = ['EN', 'ES'];
  languageSelected: string;
  loading: boolean = false;
  showAddEndpointInput: boolean = false;
  newEndpoint: string;
  conceptSelected: string;
  initGraphButtonDisabled: boolean = false;
  conceptKeys: string[] = [];

  constructor(private dbPediaService: DbPediaService) { }

  ngOnInit(): void {
  }

  filterConcepts() {
    this.dbPediaService.endpoint = this.endpointSelected;
    this.dbPediaService.language = this.languageSelected;

    this.concepts = null;
    this.loading = true;
    this.dbPediaService.getFilteredConcepts(this.value).subscribe(
      (data: Map<string, string>) => {
        this.loading = false;
        this.concepts = data;
        this.conceptKeys = Array.from(data.keys());
      }
    );
  }

  toggleAddEndpointInput(): void {
    this.showAddEndpointInput = !this.showAddEndpointInput;
  }

  addEndpointButton(): void {
    if (this.newEndpoint) {
      this.endpoints.push(this.newEndpoint);
      this.newEndpoint = null;
      this.showAddEndpointInput = false;
    }
  }

  selectConcept(concept: string): void {
    if (concept) {
      this.conceptSelected = concept;
    }
  }

  startGraph(): void {
    this.dbPediaService.addMainNode([this.conceptSelected, this.concepts.get(this.conceptSelected)]);
    this.initGraphButtonDisabled = true;
    this.opened = false;
    this.ready.emit(true);
  }

  onEndpointSelected(endpoint: string) {
    if (endpoint) {
      this.endpointSelected = endpoint;
    }
  }

  onLanguageSelected(language: string) {
    if (language) {
      this.languageSelected = language;
    }
  }
}
