import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { UIService } from '../shared/ui.service';
import { Exercise } from './exercise.model';

@Injectable()
export class TrainingService {

  public currentExercise$ = new Subject<Exercise>();
  public exercisesChange$ = new Subject<Exercise[]>();
  public finishedExercisesChange$ = new Subject<Exercise[]>();
  private destroyed$: Subject<void> = new Subject<void>();
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;

  constructor(
    private db: AngularFirestore,
    private ui: UIService) { }

  public fetchAvailableExercises(): void {
    this.ui.loadingStateChanged$.next(true);
    this.db
      .collection('availableExercises')
      .snapshotChanges()
      .pipe(
        takeUntil(this.destroyed$),
        map(docArray => {
          return docArray.map(doc => {
            return {
              id: doc.payload.doc.id,
              ...(doc.payload.doc.data() as object)
            } as Exercise;
          });
        })
      ).subscribe(result => {
        this.ui.loadingStateChanged$.next(false);
        this.availableExercises = result;
        this.exercisesChange$.next([...this.availableExercises]);
      }, error => {
        this.ui.loadingStateChanged$.next(false);
        this.ui.showSnackbar('Fetching exercises failed, please try again later', null, 3000);
      });
  }

  public getRunningExercise(): Exercise {
    return { ...this.runningExercise };
  }

  public fetchCompletedOrCancelledExercises(): void {
    this.db.collection('finishedExercises')
      .valueChanges()
      .pipe(
        takeUntil(this.destroyed$)
      ).subscribe((exercises: Exercise[]) => {
        this.finishedExercisesChange$.next(exercises);
      });
  }

  public startExercise(selectedId: string): void {
    this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
    this.currentExercise$.next({ ...this.runningExercise });
  }

  public completeExercise(): void {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed'
    });
    this.runningExercise = null;
    this.currentExercise$.next(null);
  }

  public cancelExercise(progress: number): void {
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.currentExercise$.next(null);
  }

  public cancelSubscriptions(): void {
    this.destroyed$.next();
  }

  private addDataToDatabase(exercise: Exercise): void {
    this.db.collection('finishedExercises').add(exercise);
  }
}
