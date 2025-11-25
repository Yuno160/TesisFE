import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalificacionRoutingModule } from './calificacion-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalificacionComponent } from './calificacion.component';
import { CifTreeComponent } from '../cif-tree/cif-tree.component'; // (Ajusta la ruta si es necesario)
import { TreeNodeComponent } from '../tree-node/tree-node.component'; // (Ajusta la ruta si es necesario)
import { VerCalificacionComponent } from '../ver-calificacion/ver-calificacion.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // Los necesitarás
import { ExpertoWizardComponent } from '../experto-wizard/experto-wizard.component';
@NgModule({
    imports: [
        CommonModule,
        CalificacionRoutingModule,
        SharedModule,
        ReactiveFormsModule, // Para el formulario
        FormsModule,         // Para el [(ngModel)] del buscador
    ],
    declarations: [
        CalificacionComponent,
        CifTreeComponent,
        TreeNodeComponent,
        VerCalificacionComponent,
        ExpertoWizardComponent       
    ]
})
export class CalificacionModule { }
