import React, { useState } from "react";
import questions from "./questions";

type Result = {
  low: number;
  medium: number;
  high: number;
};

const App: React.FC = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [result, setResult] = useState<Result>({ low: 0, medium: 0, high: 0 });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[step - 1] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    setIsTransitioning(true);

    setTimeout(() => {
      const currentQuestion = questions[step - 1];
      const answerIndex = answers[step - 1];
      if (answerIndex !== null) {
        const points = currentQuestion.answers[answerIndex].points;

        setResult((prev) => ({
          low: prev.low + points.low,
          medium: prev.medium + points.medium,
          high: prev.high + points.high,
        }));
      }

      setStep((prev) => prev + 1);
      setIsTransitioning(false);
    }, 300);
  };

  const handleBack = () => {
    const previousStep = step - 1;
    const previousAnswerIndex = answers[previousStep - 1];
    const points = previousAnswerIndex !== null ? questions[previousStep - 1].answers[previousAnswerIndex].points : { low: 0, medium: 0, high: 0 };

    setResult((prev) => ({
      low: prev.low - points.low,
      medium: prev.medium - points.medium,
      high: prev.high - points.high,
    }));

    setStep(previousStep);
  };

  const resetTest = () => {
    setStep(0);
    setAnswers(Array(questions.length).fill(null));
    setResult({ low: 0, medium: 0, high: 0 });
  };

  if (step === 0) {
    return (
      <div className="app">
        <h1>Скептик, реалист или мечтатель: ваш взгляд на ИИ</h1>
        <p>
          Пройдите тест из 12 вопросов, чтобы узнать, уровень вашего доверия и энтузиазма в отношении развития искусственного интеллекта.
        </p>
        <button onClick={() => setStep(1)}>Начать</button>
      </div>
    );
  }

  if (step > questions.length) {
    //const total = result.low + result.medium + result.high;
    let level = "Скептик";
    let description = `
      Скептики сомневаются в пользе и перспективах искусственного интеллекта. Они считают, 
      что ИИ может нанести больше вреда, чем принести пользы, и предпочли бы ограничить его развитие. 
      Для них технологии ИИ — это угроза или излишняя сложность, а не решение.
    `;

    if (result.medium >= 18 && result.medium <= 26) {
      level = "Реалист"
      description = `
        Реалисты видят и плюсы, и минусы ИИ. Они признают его потенциал для улучшения жизни, но осознают 
        ограничения и риски. Реалисты понимают, что внедрение ИИ должно быть сбалансированным, с учётом этики и возможных последствий.
      `;
    };
    if (result.high >= 12 && result.high <= 17) {
      level = "Мечтатель"
      description = `
      Мечтатели вдохновлены возможностями ИИ и верят, что он способен полностью преобразовать человечество. 
      Они ожидают, что ИИ решит все глобальные проблемы, сделает жизнь лучше и приведёт к утопии. 
      Для них технологии — это путь к идеальному будущему.
    `;
    };

    return (
      <div className="app">
        <h1>Вы - {level}</h1>
        <p>{description}</p>
        <button onClick={resetTest}>Пройти тест снова</button>
      </div>
    );
  }

  const question = questions[step - 1];
  const progress = (step / questions.length) * 100;

  return (
    <div className={`app ${isTransitioning ? "fade-out" : "fade-in"}`}>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
      <h4 className="question-counter">Вопрос {step} из {questions.length}</h4>
      <h1 className="question-title">{question.text}</h1>
      <form>
        {question.answers.map((answer, index) => (
          <label
            key={index}
            className={answers[step - 1] === index ? "selected" : ""}
          >
            <input
              type="radio"
              name="answer"
              value={index}
              checked={answers[step - 1] === index}
              onChange={() => handleAnswer(index)}
            />
            {answer.text}
          </label>
        ))}
      </form>
      <div className="navigation">
        <button onClick={handleBack} disabled={step === 1}>Назад</button>
        <button
          onClick={handleNext}
          disabled={answers[step - 1] === null}
        >
          Далее
        </button>
      </div>
    </div>
  );
};

export default App;