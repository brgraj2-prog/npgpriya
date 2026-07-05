let questions = [];
let currentQuestion = {};
let score = 0;
let questionNumber = 1;

/*
ADD ALL YOUR JSON FILENAMES HERE
WITHOUT .json
*/

const categories = [
 "anatomy", "biochemistry", "biology", "cardiology", 
 "dentistry", "dermatology", "embryology", "endocrinology", 
 "gastroenterology", "genetics", "geriatrics", "gynecology",
 "health_policy", "hematology", "immunology", "microbiology",
 "nephrology", "neurology", "nutrition", "obstetrics", "oncology",
 "ophthalmology", "orthopedics", "otolaryngology", "pathology",
 "pediatrics", "pharmacology", "physiology", "psychiatry",
 "public_health", "pulmonology", "radiology", "rheumatology"
];

function loadDropdown() {

  const dropdown =
    document.getElementById("categorySelect");

  dropdown.innerHTML = "";

  categories.forEach(category => {

    const option =
      document.createElement("option");

    option.value = category;

    option.textContent =
      category
        .replaceAll("_", " ")
        .replace(/\b\w/g, c => c.toUpperCase());

    dropdown.appendChild(option);
  });
}

async function loadCategory() {

  const category =
    document.getElementById("categorySelect").value;

  try {

    const response =
      await fetch(`${category}.json`);

    questions = await response.json();

    questionNumber = 1;
    score = 0;

    updateStats();

    loadRandomQuestion();

  } catch(error) {

    alert(
      "Category file not found:\n" +
      category + ".json"
    );

    console.error(error);
  }
}

function loadRandomQuestion() {

  if(questions.length === 0) {

    document.getElementById("question")
      .innerText =
      "No questions found.";

    return;
  }

  const randomIndex =
    Math.floor(Math.random() * questions.length);

  currentQuestion = questions[randomIndex];

  document.getElementById("question")
    .innerText =
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
    .innerText =
    "Score: " + score;

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

loadDropdown();
loadCategory();
