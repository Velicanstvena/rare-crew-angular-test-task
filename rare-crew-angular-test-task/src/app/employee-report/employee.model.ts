export class Employee {
  employeeName: string;
  totalHours: number;
  entryNotes: string;

  constructor(name: string, hours: number, notes: string) {
    this.employeeName = name;
    this.totalHours = hours;
    this.entryNotes = notes;
  }

  // add hours to the employee's total
  addHours(hours: number): void {
    this.totalHours += hours;
  }
}
