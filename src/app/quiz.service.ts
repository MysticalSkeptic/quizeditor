import { Injectable } from '@angular/core';

interface QuizFromWeb {
  name: string;
  questions: {
    name: string;
  }[];
}

export interface QuizQuestion {
  text: string;
}

@Injectable({
  providedIn: 'root'
})

export class QuizService {

  constructor() { }

  questionsForQuiz: QuizQuestion[] = [];

  loadQuizzes = (): QuizFromWeb[] => {

    

    const quizzesFromWeb: QuizFromWeb[] = [
      
    ];

    return quizzesFromWeb;
  }
}
