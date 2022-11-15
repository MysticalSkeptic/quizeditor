import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(
    private angularHttpSvc: HttpClient
  ) { }

  questionsForQuiz: QuizQuestion[] = [];

  loadQuizzes = (): QuizFromWeb[] => {

    

    const quizzesFromWeb: QuizFromWeb[] = [
      
    ];

    return quizzesFromWeb;
  }
}
