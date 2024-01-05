document.addEventListener('DOMContentLoaded', function () {
    const btnOpenModal = document.querySelector('#btnOpenModal');
    const modalBlock = document.querySelector('#modalBlock');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');
    const nextButton = document.querySelector('#next');
    const prevButton = document.querySelector('#prev');
    const sendButton = document.querySelector('#send');
    
const firebaseConfig = {
    apiKey: "AIzaSyDsL-aJp51FD5jU8eeRe5-RqWkQFGmUgAU",
    authDomain: "burger-a61bf.firebaseapp.com",
    databaseURL: "https://burger-a61bf-default-rtdb.firebaseio.com",
    projectId: "burger-a61bf",
    storageBucket: "burger-a61bf.appspot.com",
    messagingSenderId: "452473024892",
    appId: "1:452473024892:web:08bf4f96130605d09134f9",
    measurementId: "G-72HJ4PQNMY"
  };

    
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

    
    const getData = () => {
    formAnswers.textContent = 'LOAD';
        nextButton.classList.add('d-none');
        prevButton.classList.add('d-none');
    setTimeout(() => {
    firebase.database().ref().child('questions').once('value')
        .then(snap => playTest(snap.val()))
    }, 500);
}

const obj = {};

const inputs = [...formAnswers.elements]
    .filter(elem => elem.checked)

inputs.forEach((elem, index) => {
    obj[`${index}_${questions[numberQuestion].question}`] = elem.value;
})
    finalAnswers.push(obj)
    
   btnOpenModal.addEventListener('click', () => {
        modalBlock.classList.add('d-block');
        getData();
    })

    closeModal.addEventListener('click', () => {
        modalBlock.classList.remove('d-block');
    })

const playTest = () => {
    const finalAnswers = [];
    let numberQuestion = 0;

    const renderAnswers = (index) => {
        questions[index].answers.forEach((answer) => {
            const answerItem = document.createElement('div');

            answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center');

            answerItem.innerHTML = `
                <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none" value="${answer.title}">
                <label for="${answer.title}" class="d-flex flex-column justify-content-between">
                    <img class="answerImg" src="${answer.url}" alt="burger">
                    <span>${answer.title}</span>
                </label>
            `;

            formAnswers.appendChild(answerItem);
        })
    }

    const renderQuestions = () => {
        formAnswers.innerHTML = '';

        switch (true) {
            case numberQuestion < questions.length:
                questionTitle.textContent = `${questions[numberQuestion].question}`;
                renderAnswers(numberQuestion);
                nextButton.classList.remove('d-none');
                prevButton.classList.remove('d-none');
                sendButton.classList.add('d-none');
                break;

            case numberQuestion === 0:
                prevButton.classList.add('d-none');
                break;

            case numberQuestion === questions.length - 1:
                nextButton.classList.add('d-none');
                prevButton.classList.remove('d-none');
                sendButton.classList.add('d-none');
                break;

            case numberQuestion === questions.length:
                nextButton.classList.add('d-none');
                prevButton.classList.add('d-none');
                sendButton.classList.remove('d-none');

                formAnswers.innerHTML = `
                    <div class="form-group">
                        <label for="numberPhone">Enter your number</label>
                        <input type="phone" class="form-control" id="numberPhone">
                    </div>
                `;
                break;

            case numberQuestion === questions.length + 1:
                formAnswers.textContent = 'Спасибо за пройденный тест!';
                setTimeout(() => {
                    modalBlock.classList.remove('d-block');
                }, 2000);
                break;
        }
    };

    renderQuestions();

    const checkAnswer = () => {
        const obj = {};
        const inputs = [...formAnswers.elements].filter((input) => input.checked || input.id === 'numberPhone')

        inputs.forEach((input, index) => {
            if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
                obj[`${index}_${questions[numberQuestion].question}`] = input.value;
            }

            if (numberQuestion === questions.length) {
                obj['Номер телефона'] = input.value;
            }
        })
        finalAnswers.push(obj);
    }

    nextButton.onclick = () => {
        checkAnswer();
        numberQuestion++;
        renderQuestions();
    }

    prevButton.onclick = () => {
        numberQuestion--;
        renderQuestions();
    }

    sendButton.onclick = () => {
        checkAnswer();
        numberQuestion++;
        renderQuestions(numberQuestion);
        firebase
            .database()
            .ref()
            .child('contacts')
            .push(finalAnswers)
        
        console.log(finalAnswers);
    }
}


})
