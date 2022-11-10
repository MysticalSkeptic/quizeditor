import { Injectable } from '@angular/core';



export interface QuizQuestion {
  text: string;
}

@Injectable({
  providedIn: 'root'
})

export class QuizService {

  constructor() { }

  questionsForQuiz: QuizQuestion[] = [];

  loadQuizzes = (): any[] => {

    

    const quizzesFromWeb = [
      {}
    ];

    return quizzesFromWeb;
  }
}
