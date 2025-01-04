import React, { useState } from "react";
import questions from "./questions";
import realist from "./assets/realist.jpg";
import sceptic from "./assets/sceptic.jpg";
import dreamer from "./assets/dreamer.jpg";

const App: React.FC = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(0));
  const [totalScore, setTotalScore] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers];
    newAnswers[step - 1] = score;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    setIsTransitioning(true);

    setTimeout(() => {
      const currentScore = answers[step - 1];
      setTotalScore((prev) => prev + currentScore);
      setStep((prev) => prev + 1);
      setIsTransitioning(false);
    }, 300);
  };

  const handleBack = () => {
    const previousStep = step - 1;
    setTotalScore((prev) => prev - answers[previousStep - 1]);
    setStep(previousStep);
  };

  const resetTest = () => {
    setStep(0);
    setAnswers(Array(questions.length).fill(0));
    setTotalScore(0);
  };

  if (step === 0) {
    return (
      <div className="app">
        <h1>Скептик, реалист или мечтатель — ваш взгляд на развитие ИИ</h1>
        <p>
          Ответьте на вопросы, чтобы узнать ваш уровень энтузиазма и доверия к искусственному интеллекту.
        </p>
        <button onClick={() => setStep(1)}>Начать</button>
      </div>
    );
  }

  if (step > questions.length) {
    let category = "Скептик";
    let description = `
      Скептики сомневаются в пользе и перспективах искусственного интеллекта. Они считают, 
      что ИИ может нанести больше вреда, чем принести пользы, и предпочли бы ограничить его развитие. 
      Для них технологии ИИ — это угроза или излишняя сложность, а не решение.
    `;
    let image = sceptic;

    if (totalScore > questions.length * 1 && totalScore <= questions.length * 2) {
      category = "Реалист";
      description = `
        Реалисты видят и плюсы, и минусы ИИ. Они признают его потенциал для улучшения жизни, но осознают 
        ограничения и риски. Реалисты понимают, что внедрение ИИ должно быть сбалансированным, с учётом этики и возможных последствий.
      `;
      image = realist
    } else if (totalScore > questions.length * 2) {
      category = "Мечтатель";
      description = `
        Мечтатели вдохновлены возможностями ИИ и верят, что он способен полностью преобразовать человечество. 
        Они ожидают, что ИИ решит все глобальные проблемы, сделает жизнь лучше и приведёт к утопии. 
        Для них технологии — это путь к идеальному будущему.
      `;
      image = dreamer
    }

    return (
      <div className="app">
        <h1>Ваш результат: {category}</h1>
        <img src={image} alt={category} width={300} />
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
            className={answers[step - 1] === answer.score ? "selected" : ""}
          >
            <input
              type="radio"
              name="answer"
              value={index}
              checked={answers[step - 1] === answer.score}
              onChange={() => handleAnswer(answer.score)}
            />
            {answer.text}
          </label>
        ))}
      </form>
      <div className="navigation">
        <button
          onClick={handleBack}
          disabled={step === 1}
        >
          Назад
        </button>
        <button
          onClick={handleNext}
          disabled={answers[step - 1] === 0}
        >
          Далее
        </button>
      </div>
    </div>
  );
};

export default App;