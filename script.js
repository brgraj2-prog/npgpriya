let questions = [];
let currentQuestion = {};
let score = 0;

async function loadQuestions() {
  const response = await fetch("questions.json");
  questions = await response.json();

  loadRandomQuestion();
}

function loadRandomQuestion() {
  const randomIndex = Math.floor(Math.random() * questions.length);
  currentQuestion = questions[randomIndex];

  document.getElementById("question").innerText =
    currentQuestion.question;

  document.getElementById("category").innerText =
    "Category: " + currentQuestion.category;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  currentQuestion.options.forEach(option => {
    const btn = document.createElement("div");
    btn.classList.add("option");

    btn.innerText = option.id + ". " + option.text;

    btn.onclick = () => checkAnswer(btn, option);

    optionsDiv.appendChild(btn);
  });
}

function checkAnswer(button, option) {
  const allOptions = document.querySelectorAll(".option");

  allOptions.forEach(opt => opt.style.pointerEvents = "none");

  if (option.is_correct) {
    button.classList.add("correct");
    score++;
  } else {
    button.classList.add("wrong");

    allOptions.forEach(opt => {
      if (
        opt.innerText.startsWith(currentQuestion.correct_answer)
      ) {
        opt.classList.add("correct");
      }
    });
  }

  document.getElementById("score").innerText =
    "Score: " + score;

  alert(option.explanation);
}

document.getElementById("nextBtn").addEventListener("click", () => {
  loadRandomQuestion();
});

loadQuestions();

