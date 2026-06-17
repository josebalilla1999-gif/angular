import { Component, OnInit } from '@angular/core';
import { VuelosService } from '../vuelos/vuelos.service';
import { Vuelo } from '../vuelos/vuelos.model';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-vuelos',
  imports: [CommonModule],
  templateUrl: './vuelos.html',
  styleUrls: ['./vuelos.css'],
  standalone: true
})
export class Vuelos implements OnInit {

  vuelos: Vuelo[] = [];

  constructor(private vuelosService: VuelosService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.cargarVuelos();
  }

  cargarVuelos(): void {
    this.vuelosService.obtenerVuelos().subscribe({
      next: (data) => {
        this.vuelos = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}