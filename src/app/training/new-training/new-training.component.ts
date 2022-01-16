import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UIService } from 'src/app/shared/ui.service';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  public form: FormGroup = this.fb.group({
    exerciseId: ['', Validators.required]
  });
  public exercises: Exercise[];
  public isLoading = false;
  private destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private trainingService: TrainingService,
    private ui: UIService) { }

  ngOnInit(): void {
    this.ui.loadingStateChanged$
      .pipe(
        takeUntil(this.destroyed$)
      ).subscribe(isLoading => {
        this.isLoading = isLoading;
      });
    this.trainingService.exercisesChange$
      .pipe(
        takeUntil(this.destroyed$)
      ).subscribe(exercises => {
        this.exercises = exercises;
      });
    this.trainingService.fetchAvailableExercises();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  public onStartTraining(): void {
    this.trainingService.startExercise(this.form.value.exerciseId);
  }

  public fetchExercises(): void {
    this.trainingService.fetchAvailableExercises();
  }
}
