import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../services/loader.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  isLoading: Subject<boolean> = this.loaderService.isLoading;

  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
  }

}
