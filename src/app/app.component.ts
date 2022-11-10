import { Component, NgModule, OnInit } from '@angular/core';
import { QuizService } from './quiz.service';

interface QuizDisplay {
  quizName: string;
  quizQuestions: QuestionDisplay[];
}

interface QuestionDisplay {
  questionText: string;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  constructor(private quizSvc: QuizService) {}

  ngOnInit() {
    const data = this.quizSvc.loadQuizzes();

    this.quizzes = data.map((x: any) => ({
      quizName: x.name,
      quizQuestions: x.questions.map((y: any) => ({
        questionText: y.name
      }))
    }));
    
  }

  addNewQuiz = () => {
    
    const newQuiz: QuizDisplay = {
      quizName: 'Untitled Quiz',
      quizQuestions: []
    };

    this.quizzes = [
      ...this.quizzes,
      newQuiz
    ];

  };

  quizzes: QuizDisplay[] = [];

  quizQuestion: QuestionDisplay[] = [];

  selectedQuiz: QuizDisplay | undefined = undefined;

  selectQuiz = (quizToSelect: QuizDisplay) => {
    this.selectedQuiz = quizToSelect;
  };

  addNewQuestion = () => {
    if (this.selectedQuiz != undefined) {
      this.selectedQuiz.quizQuestions = [
        ...this.selectedQuiz.quizQuestions,
        {
          questionText: 'New Question'
        }
      ]
    }
  };

  removeQuestion = (questionToRemove: QuestionDisplay) => {
    if (this.selectedQuiz != undefined) {
      this.selectedQuiz.quizQuestions = this.selectedQuiz.quizQuestions.filter(x => x !== questionToRemove)
    }
  };

  

  // writtenQuestion = "";

  // clicked = () => {
  //   console.log(this.writtenQuestion);
    

  // };

}
