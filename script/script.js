import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  child,
  get,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAX_s9yU_yPpdynfPBfGTzIjuYC7zcGTzA",
  authDomain: "burgerquiz-8646e.firebaseapp.com",
  databaseURL:
    "https://burgerquiz-8646e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "burgerquiz-8646e",
  storageBucket: "burgerquiz-8646e.appspot.com",
  messagingSenderId: "792495562848",
  appId: "1:792495562848:web:c07f038dc637e8fa00e305",
  measurementId: "G-SLM92DDWNZ",
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const dbRef = ref(getDatabase(app));

document.addEventListener("DOMContentLoaded", function () {
  const btnOpenModal = document.querySelector("#btnOpenModal");
  const modalBlock = document.querySelector("#modalBlock");
  const closeModal = document.querySelector("#closeModal");
  const questionTitle = document.querySelector("#question");
  const formAnswers = document.querySelector("#formAnswers");
  const prevButton = document.querySelector("#prev");
  const nextButton = document.querySelector("#next");
  const sendButton = document.querySelector("#send");

  // Initialize Firebase

  function getData() {
    formAnswers.textContent = "LOAD";
    nextButton.classList.add("d-none");
    prevButton.classList.add("d-none");

    get(child(dbRef, "questions"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          playTest(snapshot.val());
          nextButton.classList.remove("d-none");
        } else {
          formAnswers.textContent = "Ошибка загрузки данных";
        }
      })
      .catch((error) => {
        console.error(error);
      });

    // fetch("/questions.json").then((res) =>
    //   res
    //     .json()
    //     .then((data) => playTest(data.questions))
    //     .catch((err) => {
    //       formAnswers.textContent = "Ошибка загрузки данных";
    //       console.error(err);
    //     })
    // );
  }

  btnOpenModal.addEventListener("click", () => {
    modalBlock.classList.add("d-block");

    getData();
  });

  closeModal.addEventListener("click", () => {
    modalBlock.classList.remove("d-block");
  });

  const playTest = (questions) => {
    let numberQuestion = 0;
    let finalAnswers = [];

    const updateMarkup = () => {
      switch (numberQuestion) {
        case 0:
          prevButton.classList.add("d-none");
          nextButton.classList.remove("d-none");
          sendButton.classList.add("d-none");
          break;
        case questions.length:
          prevButton.classList.remove("d-none");
          nextButton.classList.add("d-none");
          sendButton.classList.remove("d-none");

          formAnswers.innerHTML = `
          <div class="form-group">
            <label for="numberPhone">Enter your number</label>
            <input type="phone" class="form-control" id="numberPhone">
          </div>
          `;
          break;
        default:
          nextButton.classList.remove("d-none");
          prevButton.classList.remove("d-none");
          sendButton.classList.add("d-none");
          break;
      }
    };

    const renderAnswers = (index) => {
      questions[index].answers.forEach((answer) => {
        const answerItem = document.createElement("div");

        answerItem.classList.add(
          "answers-item",
          "d-flex",
          "justify-content-center"
        );

        answerItem.innerHTML = `
              <input type="${questions[index].type}" id="answerItem${questions[
          index
        ].answers.indexOf(answer)}" name="answer" class="d-none">
              <label for="answerItem${questions[index].answers.indexOf(
                answer
              )}" class="d-flex flex-column justify-content-between">
                  <img class="answerImg" src="${answer.url}" alt="burger">
                  <span>${answer.title}</span>
              </label>
          `;

        formAnswers.appendChild(answerItem);
      });
    };

    const renderQuestions = (indexQuestion) => {
      formAnswers.innerHTML = "";
      updateMarkup();

      console.log(indexQuestion, questions.length - 1);
      if (indexQuestion < questions.length) {
        questionTitle.textContent = questions[indexQuestion].question;
        renderAnswers(indexQuestion);
      } else if (indexQuestion === questions.length + 1) {
        questionTitle.textContent = "Thank you for your answers!";

        setTimeout(() => {
          modalBlock.classList.remove("d-block");
        }, 2000);
      }
    };

    renderQuestions(numberQuestion);

    const checkAnswer = () => {
      const obj = {};

      const inputs = [...formAnswers.elements].filter(
        (input) => input.checked || input.id === "numberPhone"
      );

      inputs.forEach((input, index) => {
        if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
          obj[`${index}_${questions[numberQuestion].question}`] =
            input.nextElementSibling.textContent.trim();
        }

        if (numberQuestion === questions.length) {
          obj["Номер телефона"] = input.value;
        }
      });

      finalAnswers.push(obj);
    };

    nextButton.onclick = () => {
      checkAnswer();
      numberQuestion++;
      renderQuestions(numberQuestion);
    };

    prevButton.onclick = () => {
      checkAnswer();
      numberQuestion--;
      renderQuestions(numberQuestion);
    };

    sendButton.onclick = () => {
      checkAnswer();
      numberQuestion++;
      renderQuestions(numberQuestion);
      push(child(dbRef, "orders"), finalAnswers);
      console.log(finalAnswers);
    };
  };
});
