import {Component, OnInit} from '@angular/core';
import {Chart} from 'chart.js/auto';
import ChartDataLabels from "chartjs-plugin-datalabels"
import {Employee} from './employee.model';
import {NgForOf} from "@angular/common";

// Register the plugin with Chart.js
Chart.register(ChartDataLabels);

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
        this.createPieChart();
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

  createPieChart() {
    const labels = this.employees.map(employee => employee.employeeName);
    const data = this.employees.map(employee => employee.totalHours);

    console.log('Labels:', labels);
    console.log('Data:', data);

    this.pieChart = new Chart('employeeHoursPieChart', {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733', '#C70039', '#900C3F', '#581845'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || '';

                const value = typeof context.raw === 'number' ? context.raw : 0;

                const total = context.dataset.data.reduce((sum, current) => sum + current, 0);
                const totalValue = typeof total === 'number' ? total : 1;

                const percentage = ((value / totalValue) * 100).toFixed(2);

                return `${label}: ${percentage}% (${value.toFixed(2)} hours)`;
              }
            }
          },
          datalabels: {
            color: '#fff',
            font: {
              weight: 'bold',
            },
            formatter: (value, context) => {
              const dataValues = context.dataset.data as number[];
              const total = dataValues.reduce((sum, current) => {
                return sum + current;
              }, 0);

              const percentage = total > 0 ? ((value / total) * 100).toFixed(2) : '0';
              return `${percentage}%`;
            },
            anchor: 'center',
            align: 'center'
          }
        }
      }
    });
  }
}
