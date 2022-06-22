import { Component, Input, OnInit } from '@angular/core';
import { Node, NodeType, RelationState } from '../../../d3';
import { DbPediaService } from 'src/app/services/dbpedia.service';
import { DataGraphService } from 'src/app/services/data-graph.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ChooseObjectDialogComponent, DialogChooseObject, DialogType } from '../../dialogs/choose-object-dialog/choose-object-dialog.component';

@Component({
  selector: '[nodeVisual]',
  templateUrl: './node-visual.component.html',
  styleUrls: ['./node-visual.component.css']
})
export class NodeVisualComponent implements OnInit {
  @Input('nodeVisual') node: Node;
  linkLabelRelated: string;

  constructor(private dbPediaService: DbPediaService,
    private dataGraphService: DataGraphService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (this.node.type != NodeType.ConceptoPrincipal)
      this.linkLabelRelated = this.dataGraphService.getLinkLabelRelatedWithNode(this.node.id);
  }

  onArrowClick() {
    if (this.node.relationState == RelationState.SinExplorar) {
      this.dbPediaService.getRelations(this.node.name);
      this.node.relationState = RelationState.Exploradas;
    } else {
      this.node.relationState = RelationState.Exploradas;
      this.dataGraphService.setRelationNodesVisibility(false);
    }
  }

  showArrow(): boolean {
    return this.node.type == NodeType.ConceptoPrincipal && this.node.relationState != RelationState.Exploradas;
  }

  selectNode(): void {
    if (this.node.type == NodeType.SinExplorar) {
      this.dbPediaService.relationSelected = this.node.name;
      this.openChooseConceptDialog();
    } else if (this.node.type == NodeType.LiteralVacio) {
      this.openTypeFilterDialog();
    } else if (this.node.type == NodeType.InstanceCount) {
      this.dataGraphService.hideNode(this.node.id);
      this.dbPediaService.getInstances();
    } else if (this.node.type == NodeType.Concepto) {
      this.dbPediaService.relationSelected = this.node.name;
      this.dataGraphService.setRelationNodesVisibility(true, this.node.id);
    }
  }

  selectDataNode(): void {

    if (this.node.type == NodeType.Concepto) {
      this.updateQueryParameters();
      this.openChoosePropertyDialog();
    } else if (this.node.type == NodeType.LiteralRelleno) {
      this.dbPediaService.getIntancesCount();
    } else if (this.node.type == NodeType.ConceptoPrincipal) {
      this.openChoosePropertyMainConceptDialog();
    } else if (this.node.type == NodeType.PropiedadConceptoPrincipal) {
      this.dataGraphService.hideNode(this.node.id);
      this.dbPediaService.getInstancePropertyValue();
    }
  }

  showDataBtn(): boolean {
    return this.node.type == NodeType.Concepto 
    || this.node.type == NodeType.LiteralRelleno 
    || (this.node.type == NodeType.ConceptoPrincipal && this.dataGraphService.IsThereVisibleInstanceNodes())
    || this.node.type == NodeType.PropiedadConceptoPrincipal;
  }

  openChooseConceptDialog(): void {
    const dialogConfig = new MatDialogConfig<DialogChooseObject>();

    dialogConfig.panelClass = 'custom-dialog-container';

    dialogConfig.data = {
      title: 'Choose a concept of ' + this.linkLabelRelated,
      type: DialogType.PickFromList
    };

    this.dbPediaService.getObjectList().subscribe(
      (response) => {
        if (response) {
          dialogConfig.data.values = response;

          const dialogRef = this.dialog.open(ChooseObjectDialogComponent, dialogConfig);

          dialogRef.afterClosed().subscribe(
            (result: [string, string]) => {
              if (result) {
                this.dataGraphService.setRelationNodesVisibility(true);
                let nuNode = this.dataGraphService.addNode(result[1], NodeType.Concepto, result[0]);
                this.dataGraphService.copyLinkWithMainConcept(nuNode, this.node)
                this.dbPediaService.relationConceptSelected = result[1];
                this.dataGraphService.canRefreshGraph();
              }
            });
        }
      });
  }

  openChoosePropertyDialog(): void {
    const dialogConfig = new MatDialogConfig<DialogChooseObject>();

    dialogConfig.panelClass = 'custom-dialog-container';

    dialogConfig.data = {
      title: 'Choose a property of ' + this.node.label,
      type: DialogType.PickFromList
    };

    this.dbPediaService.getPropertyList().subscribe(
      (response) => {
        if (response) {
          dialogConfig.data.values = response;

          const dialogRef = this.dialog.open(ChooseObjectDialogComponent, dialogConfig);

          dialogRef.afterClosed().subscribe(
            (result: [string, string]) => {
              if (result) {
                this.dbPediaService.propertyConceptSelected = result[1];

                let nuNode = this.dataGraphService.addNode(result[1], NodeType.LiteralVacio, '');
                this.dataGraphService.addLink(this.node, nuNode, result[1], result[0]);
                this.dataGraphService.canRefreshGraph();
              }
            });
        }
      });
  }

  showCircle(): boolean {
    return this.node.type != NodeType.LiteralVacio && this.node.type != NodeType.LiteralRelleno && this.node.type != NodeType.ValorPropiedadInstancia;
  }

  openTypeFilterDialog(): void {
    const dialogConfig = new MatDialogConfig<DialogChooseObject>();

    dialogConfig.panelClass = 'custom-dialog-container';

    dialogConfig.data = {
      title: 'Type a filter of ' + this.linkLabelRelated,
      type: DialogType.TypeValue
    };

    const dialogRef = this.dialog.open(ChooseObjectDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      (result: string) => {
        if (result) {
          this.dbPediaService.literalTyped = result;

          this.node.label = result;
          this.node.type = NodeType.LiteralRelleno;
          this.dataGraphService.canRefreshGraph();
        }
      });
  }

  showNode(): boolean {
    return !this.node.hidden;
  }

  openChoosePropertyMainConceptDialog(): void {
    const dialogConfig = new MatDialogConfig<DialogChooseObject>();

    dialogConfig.panelClass = 'custom-dialog-container';

    dialogConfig.data = {
      title: 'Choose a property of ' + this.node.label,
      type: DialogType.PickFromList
    };

    this.dbPediaService.getPropertyMainConceptList().subscribe(
      (response) => {
        if (response) {
          dialogConfig.data.values = response;

          const dialogRef = this.dialog.open(ChooseObjectDialogComponent, dialogConfig);

          dialogRef.afterClosed().subscribe(
            (result: [string, string]) => {
              if (result) {
                this.dbPediaService.propertyLabelMainConceptSelected = result[0];
                this.dbPediaService.propertyMainConceptSelected = result[1];

                let nuNode = this.dataGraphService.addNode(result[1], NodeType.PropiedadConceptoPrincipal, '');
                this.dataGraphService.addLink(this.node, nuNode, result[1], result[0]);
                this.dataGraphService.canRefreshGraph();
              }
            });
        }
      });
  }

  public getDataButtonText(): string {
    let text: string;

    switch (this.node.type) {
      case NodeType.Concepto:
        text = "Property";
        break;
      case NodeType.LiteralRelleno:
        text = "Search";
        break;
      case NodeType.ConceptoPrincipal:
        text = "Property";
        break;
      case NodeType.PropiedadConceptoPrincipal:
      default:
        text = "Data";
        break;
    }

    return text;
  }

  private updateQueryParameters() {
    this.dbPediaService.relationSelected = this.dataGraphService.getRelationNameWithMainConcept(this.node);
    this.dbPediaService.relationConceptSelected = this.node.name;
  }
}
