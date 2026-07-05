const categories = [
  "anatomy",
  "biochemistry",
  "biology",
  "cardiology",
  "dentistry",
  "dermatology",
  "embryology",
  "endocrinology",
  "gastroenterology",
  "genetics",
  "geriatrics",
  "gynecology",
  "health_policy",
  "hematology",
  "immunology",
  "microbiology",
  "nephrology",
  "neurology",
  "nutrition",
  "obstetrics",
  "oncology",
  "ophthalmology",
  "orthopedics",
  "otolaryngology",
  "pathology",
  "pediatrics",
  "pharmacology",
  "physiology",
  "psychiatry"
];

const categoryIcons = {
  anatomy: "🦴",
  biochemistry: "🧪",
  biology: "🧬",
  cardiology: "❤️",
  dentistry: "🦷",
  dermatology: "🧴",
  embryology: "👶",
  endocrinology: "⚕️",
  gastroenterology: "🫃",
  genetics: "🧬",
  geriatrics: "👴",
  gynecology: "👩",
  health_policy: "📋",
  hematology: "🩸",
  immunology: "🛡️",
  microbiology: "🦠",
  nephrology: "🩺",
  neurology: "🧠",
  nutrition: "🥗",
  obstetrics: "🤰",
  oncology: "🎗️",
  ophthalmology: "👁️",
  orthopedics: "🦴",
  otolaryngology: "👂",
  pathology: "🔬",
  pediatrics: "🧒",
  pharmacology: "💊",
  physiology: "⚡",
  psychiatry: "🧠"
};

const app = document.getElementById("app");

function renderHomePage(filtered = categories) {

  app.innerHTML = `

    <div class="top-search">

      <input
        type="text"
        id="searchInput"
        placeholder="Search specialties..."
      />

    </div>

    <div class="category-grid">

      ${filtered.map(category => `

        <div class="category-card">

          <div class="icon">
            ${categoryIcons[category] || "🩺"}
          </div>

          <h2>
            ${formatTitle(category)}
          </h2>

          <p>
            Practice MCQs from
            ${formatTitle(category)}
          </p>

          <div class="card-footer">

            <span>
              30 Questions
            </span>

            <button
              onclick="startQuiz('${category}')"
            >
              Practice
            </button>

          </div>

        </div>

      `).join("")}

    </div>
  `;

  document
    .getElementById("searchInput")
    .addEventListener("input", searchCategories);
}

function formatTitle(text) {

  return text
    .replaceAll("_", " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

function searchCategories(e) {

  const value =
    e.target.value.toLowerCase();

  const filtered =
    categories.filter(category =>
      category.includes(value)
    );

  renderHomePage(filtered);
}

async function startQuiz(category) {

  app.innerHTML = `
    <div class="loading">
      Loading ${formatTitle(category)}...
    </div>
  `;

  try {

    const response =
      await fetch(`${category}.json`);

    const questions =
      await response.json();

    loadQuestionPage(
      category,
      questions
    );

  } catch(error) {

    app.innerHTML = `
      <div class="error">
        Failed to load category.
      </div>
    `;

    console.error(error);
  }
}

function loadQuestionPage(category, questions) {

  let currentIndex = 0;
  let score = 0;

  function renderQuestion() {

    const question =
      questions[currentIndex];

    app.innerHTML = `

      <div class="quiz-header">

        <button onclick="renderHomePage()">
          ← Back
        </button>

        <div>
          ${formatTitle(category)}
        </div>

        <div>
          Score: ${score}
        </div>

      </div>

      <div class="quiz-card">

        <h2 class="question">
          ${question.question}
        </h2>

        <div class="options">

          ${question.options.map(option => `

            <div
              class="option"
              onclick="
                checkAnswer(
                  this,
                  ${option.is_correct},
                  '${option.explanation || ""}'
                )
              "
            >
              ${option.id}.
              ${option.text}
            </div>

          `).join("")}

        </div>

        <button
          class="next-btn"
          onclick="nextQuestion()"
        >
          Next Question
        </button>

      </div>
    `;

    window.nextQuestion = () => {

      currentIndex++;

      if(currentIndex >= questions.length) {

        currentIndex = 0;
      }

      renderQuestion();
    };

    window.checkAnswer = (
      element,
      isCorrect,
      explanation
    ) => {

      const options =
        document.querySelectorAll(".option");

      options.forEach(opt => {
        opt.style.pointerEvents = "none";
      });

      if(isCorrect) {

        element.classList.add("correct");

        score++;

      } else {

        element.classList.add("wrong");
      }

      if(explanation) {

        setTimeout(() => {

          alert(
            "Explanation:\n\n" +
            explanation
          );

        }, 300);
      }
    };
  }

  renderQuestion();
}

renderHomePage();

