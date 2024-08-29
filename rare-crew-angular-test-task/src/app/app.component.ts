import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {EmployeeReportComponent} from "./employee-report/employee-report.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EmployeeReportComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'rare-crew-angular-test-task';
}
