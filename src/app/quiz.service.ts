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
      {
        name: 'Quiz 1',
        questions: [
          {
            name: 'Question 1'
          }
          // this.questionsForQuiz = [
          //   ...this.questionsForQuiz
          // ]
        ]
      },
      {
        name: 'Quiz 2',
        questions: []
      }
    ];

    return quizzesFromWeb;
  }
}
