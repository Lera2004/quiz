document.addEventListener('DOMContentLoaded', function () {
    const btnOpenModal = document.querySelector('#btnOpenModal');
    const modalBlock = document.querySelector('#modalBlock');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');
    const nextButton = document.querySelector('#next');
    const prevButton = document.querySelector('#prev');
    const sendButton = document.querySelector('#send');

    const getData = () => {
        formAnswers.textContent = 'LOAD';
        
       
        setTimeout(() => {
             fetch('./questions.json')
            .then(res => res.json())
            .then(obj => playTest(obj.questions))
                 .catch(err => {
                     formAnswers.textContent = 'Ошибка загрузки данных!'
                     console.error(err)
                 })
        }, 1000)
    }

    
   btnOpenModal.addEventListener('click', () => {
        modalBlock.classList.add('d-block');
        getData();
    })

    closeModal.addEventListener('click', () => {
        modalBlock.classList.remove('d-block');
    })

    const playTest = (questions) => {
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

        const renderQuestions = (indexQuestion) => {
    formAnswers.innerHTML = '';

    switch (true) {
        case indexQuestion < questions.length:
            questionTitle.textContent = `${questions[indexQuestion].question}`;
            renderAnswers(indexQuestion);
            nextButton.classList.remove('d-none');
            prevButton.classList.remove('d-none');
            sendButton.classList.add('d-none');
            break;

        case numberQuestion === 0:
            prevButton.classList.add('d-none');
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




        renderQuestions(numberQuestion);

        const checkAnswer = () => {
            const obj = {};
            const inputs = [...formAnswers.elements].filter((input)=>input.checked || input.id === 'numberPhone')

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
            renderQuestions(numberQuestion);
        }

        prevButton.onclick = () => {
            numberQuestion--;
            renderQuestions(numberQuestion);
        }

        sendButton.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);
            console.log(finalAnswers);
        }
    }

})

