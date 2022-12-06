import { Component, OnInit } from '@angular/core';
import { QuizService } from './quiz.service';
import {
  trigger,
  transition,
  animate,
  keyframes,
  style
} from '@angular/animations';

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
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('detailsFromLeft', [
      transition('leftPosition => finalPosition', [
        animate('300ms', keyframes([
          style({ marginLeft: '-30px', offset: 0.0 }),
          style({ marginLeft: '-20px', offset: 0.25 }),
          style({ marginLeft: '-10px', offset: 0.5 }),
          style({ marginLeft: '-5px', offset: 0.75 }),
          style({ marginLeft: '0px', offset: 1.0 })
        ]))
      ]),
    ]),
    trigger('pulseSaveCancelButtons', [
      transition('nothingToSave => somethingToSave', [
        animate('400ms', keyframes([
          style({ transform: 'scale(1.0)', 'transform-origin': 'top left', offset: 0.0 }),
          style({ transform: 'scale(1.2)', 'transform-origin': 'top left', offset: 0.5 }),
          style({ transform: 'scale(1.0)', 'transform-origin': 'top left', offset: 1.0 })
        ]))
      ])
    ])
  ]
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
    this.detailsAnimationState = 'finalPosition';
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
    this.isQuizEdited(x)
  );

  get editedQuizCount() {
    return this.getEditedQuizzes().length;
  };

  isQuizEdited = (q: QuizDisplay) => 
    !q.newlyAdded
    && !q.markedForDelete
    && this.generateNaiveChecksum(q) != q.naiveChecksum;

    detailsAnimationState = "leftPosition";

    detailsAnimationDone = () => {
      this.detailsAnimationState = "leftPosition";
    }
}

