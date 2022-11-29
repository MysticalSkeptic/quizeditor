import { Component, NgModule, OnInit } from '@angular/core';
import { QuizService } from './quiz.service';

interface QuizDisplay {
  quizName: string;
  quizQuestions: QuestionDisplay[];
  markedForDelete: boolean;
  newlyAdded: boolean;
  naiveChecksum?: string;
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

  errorLoadingQuizzes = false;

  quizPageLoading = true;

  loadQuizzesFromWeb = async () => {
    try {
      this.quizPageLoading = true;
      
      const data = await this.quizSvc.loadQuizzes();
      console.log(data);

      this.quizzes = data.map(x => ({
        quizName: x.name,
        quizQuestions: x.questions.map(y => ({
          questionText: y.name
        })),
        markedForDelete: false,
        newlyAdded: false,
      }));

      this.quizzes = this.quizzes.map(x => ({
        ...x,
        naiveChecksum: this.generateNaiveChecksum(x)
      }));
    
    }

    catch (err) {
      console.log(err);
      this.errorLoadingQuizzes = true;
    }

    finally {
      this.quizPageLoading = false;
    }
  };

  ngOnInit() {
    this.loadQuizzesFromWeb();
  }

  addNewQuiz = () => {
    
    const newQuiz: QuizDisplay = {
      quizName: 'Untitled Quiz',
      quizQuestions: [],
      markedForDelete: false,
      newlyAdded: true
    };

    this.quizzes = [
      ...this.quizzes,
      newQuiz
    ];

    this.selectQuiz(newQuiz);

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

  jsPromisesOne = () => {
    const n1 = this.quizSvc.getMagicNumber(true);
    console.log(n1);

    n1.then(
      n => {
        console.log(n);

        const n2 = this.quizSvc.getMagicNumber(true);
        console.log(n2);

        n2.then(
          n => console.log(n)
        ).catch(
          e => console.log(e)
          )
      }
      
    ).catch(
      e => console.log(e)
    )
  };

  jsPromisesTwo = async () => {
    try {
      const n1 = await this.quizSvc.getMagicNumber(true);
      console.log(n1);

      const n2 = await this.quizSvc.getMagicNumber(true);
      console.log(n2);
    }

    catch (err) {
      console.log(err)
    }
  };

  jsPromisesThree = async () => {
    try {
      const n1 = this.quizSvc.getMagicNumber(true);
      console.log(n1);

      const n2 = this.quizSvc.getMagicNumber(false);
      console.log(n2);

      // const results = await Promise.all([n1, n2]);
      // const results = Promise.race([n1, n2]);
      const results = await Promise.any([n1, n2]);
      console.log(results);
    }

    catch (err) {
      console.log(err)
    }
  };

  cancelAllChanges = () => {
    this.loadQuizzesFromWeb();
    this.selectedQuiz = undefined;
  };

  getDeletedQuizzes = () => this.quizzes.filter(x => x.markedForDelete);

  get deletedQuizCount() {
    return this.getDeletedQuizzes().length;
  };

  getAddedQuizzes = () => this.quizzes.filter(x => 
    x.newlyAdded
    && !x.markedForDelete
    );

  get addedQuizCount() {
    return this.getAddedQuizzes().length;
  };

  generateNaiveChecksum = (q: QuizDisplay) => {
    return q.quizName
      + "~"
      + q.quizQuestions.map(x => x.questionText).join("~");
  };

  getEditedQuizzes = () => this.quizzes.filter(x => 
    !x.newlyAdded
    && !x.markedForDelete
    && this.generateNaiveChecksum(x) != x.naiveChecksum
    );

  get editedQuizCount() {
    return this.getEditedQuizzes().length;
  };

}
