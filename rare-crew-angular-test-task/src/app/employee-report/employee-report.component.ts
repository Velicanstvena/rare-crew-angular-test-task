import {Component, OnInit} from '@angular/core';
import {Employee} from './employee.model';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-report.component.html',
  standalone: true,
  imports: [
    NgForOf
  ],
  styleUrls: ['./employee-report.component.css']
})
export class EmployeeReportComponent implements OnInit {
  employees: Employee[] = [];
  pieChart: any;

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    const url = 'https://rc-vault-fap-live-1.azurewebsites.net/api/gettimeentries?code=vO17RnE8vuzXzPJo5eaLLjXjmRW07law99QTD90zat9FfOQJKKUcgQ==';

    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('Raw data:', data);
        this.employees = this.processData(data);
        console.log('Processed employee data:', this.employees);
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  processData(data: any[]): Employee[] {
    const employeeArray: Employee[] = [];

    data.forEach(entry => {
      if (!entry.EmployeeName) return;

      const startTime = new Date(entry.StarTimeUtc);
      const endTime = new Date(entry.EndTimeUtc);
      const hoursWorked = Math.abs((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));

      const existingEmployee = employeeArray.find(e => e.employeeName === entry.EmployeeName);

      if (existingEmployee) {
        existingEmployee.addHours(hoursWorked);
      } else {
        employeeArray.push(new Employee(entry.EmployeeName, hoursWorked, entry.EntryNotes));
      }
    });

    return employeeArray.sort((a, b) => b.totalHours - a.totalHours);
  }
}
