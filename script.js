let questions = [];
let currentQuestion = {};
let score = 0;
let questionNumber = 1;

async function loadCategory() {

  const category =
    document.getElementById("categorySelect").value;

  const response =
    await fetch(`npgpriya/${category}.json`);

  questions = await response.json();

  questionNumber = 1;
  score = 0;

  updateStats();

  loadRandomQuestion();
}

function loadRandomQuestion() {

  const randomIndex =
    Math.floor(Math.random() * questions.length);

  currentQuestion = questions[randomIndex];

  document.getElementById("question").innerText =
    currentQuestion.question;

  const optionsDiv =
    document.getElementById("options");

  optionsDiv.innerHTML = "";

  currentQuestion.options.forEach(option => {

    const optionBtn =
      document.createElement("div");

    optionBtn.classList.add("option");

    optionBtn.innerText =
      option.id + ". " + option.text;

    optionBtn.onclick = () =>
      checkAnswer(optionBtn, option);

    optionsDiv.appendChild(optionBtn);
  });
}

function checkAnswer(button, option) {

  const allOptions =
    document.querySelectorAll(".option");

  allOptions.forEach(opt => {
    opt.style.pointerEvents = "none";
  });

  if(option.is_correct) {

    button.classList.add("correct");

    score++;

  } else {

    button.classList.add("wrong");

    allOptions.forEach(opt => {

      if(
        opt.innerText.startsWith(
          currentQuestion.correct_answer
        )
      ) {
        opt.classList.add("correct");
      }
    });
  }

  updateStats();

  setTimeout(() => {

    if(currentQuestion.explanation) {

      alert(
        "Explanation:\n\n" +
        currentQuestion.explanation
      );
    }

  }, 300);
}

function updateStats() {

  document.getElementById("score")
    .innerText = "Score: " + score;

  document.getElementById("questionCount")
    .innerText =
      "Question: " + questionNumber;
}

document.getElementById("nextBtn")
  .addEventListener("click", () => {

    questionNumber++;

    updateStats();

    loadRandomQuestion();
});

loadCategory();

