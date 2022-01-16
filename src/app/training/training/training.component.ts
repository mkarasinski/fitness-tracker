import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {

  public ongoingTraining = false;
  private destroyed$ = new Subject<void>();

  constructor(private trainingService: TrainingService) { }

  ngOnInit(): void {
    this.trainingService.currentExercise$
      .pipe(
        takeUntil(this.destroyed$)
      ).subscribe(exercise => exercise ? this.ongoingTraining = true : this.ongoingTraining = false);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
