import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { EventosInterface } from '../../shared/interfaces/eventos.interface';
import { EdecanesInterface } from '../../shared/interfaces/edecanes.interface';
import { ResponseInterface } from '../../shared/interfaces/response.interface';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  eventos: EventosInterface[] = [];
  edecanes: EdecanesInterface[] = [];

  constructor(
    private apiService: ApiService
  ) { }

  async ngOnInit(): Promise<void> {
     const _eventos = await this.findEventos();
     this.eventos = _eventos.result;

     const _edecanes = await this.findEdecanes();
     this.edecanes = _edecanes.result;
  }

  findEventos(): Promise<ResponseInterface> {
    return this.apiService.findAll('evento')
      .toPromise();
  }

  findEdecanes(): Promise<ResponseInterface> {
    return this.apiService.findAll('edecan')
      .toPromise();
  }

}
