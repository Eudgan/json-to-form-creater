let input = document.getElementById('fileInput');

let addStandartAtrs = function(tag, input) {
    for (let atr in tag) {
        if (atr === 'required') {
            if (tag[atr]) {
                input.setAttribute(atr, '');
            }
        } else if (atr === 'checked') {
            if (tag[atr]) {
                input.setAttribute(atr, '');
            }
        } else {
            input.setAttribute(atr, tag[atr]);
        }
    }
}

// Добавляем обработчик события 'change'
input.addEventListener('change', function(e) {
    let newForm = document.createElement("form");
    newForm.setAttribute('id', 'myForm');

    let formWrap = document.querySelector('.form-wrapper');
    let lastForm = document.getElementById('myForm');

    // Удаляем форму, если уже была
    if (lastForm !== null) {
        formWrap.removeChild(lastForm);
    }

    // Получаем первый файл из списка
    let file = e.target.files[0];

    // Создаем объект FileReader
    let reader = new FileReader();

    // Добавляем обработчик события 'load'
    reader.onload = function(e) {
    // Получаем результат чтения файла
    let text = e.target.result;

    // Преобразуем текст в объект JavaScript
    let obj = JSON.parse(text);

    for (let key in obj) {
        switch (key) {
            case 'fields': 
                for (let tags of obj.fields) {
                    if ('label' in tags) {
                        let newDiv = document.createElement("div");
                        let newLabel = document.createElement("label");
                        let newInput = document.createElement("input");

                        newLabel.innerHTML = tags.label;

                        // Добавил тег на основе текста label, чтобы объеденить с input
                        let id = tags.label.toLowerCase();
                        newLabel.setAttribute('for', id);
                        newInput.setAttribute('id', id);

                        addStandartAtrs(tags.input, newInput);
                        
                        newDiv.appendChild(newLabel);
                        newDiv.appendChild(newInput);
                        newForm.appendChild(newDiv);
                    } else {
                        let newInput = document.createElement("input");
                        
                        addStandartAtrs(tags.input, newInput);

                        newForm.appendChild(newInput);
                    }
                }
            break;
            case 'references':
                for (let tags of obj.references) {
                    if ('input' in tags) {
                        let newInput = document.createElement("input");

                        addStandartAtrs(tags.input, newInput);

                        newForm.appendChild(newInput);
                    } else {
                        if ('text without ref' in tags) {
                            // Не понял что значит "text without ref" сделал обычным параграфом
                            let newP = document.createElement('p');
                            newP.innerHTML = tags['text without ref'];
                            newForm.appendChild(newP);
                        } 
                        if ('ref' in tags) {
                            let newA = document.createElement('a');
                            newA.innerHTML = tags['text'];
                            newA.setAttribute('href', '/' + tags['ref']);
                            newForm.appendChild(newA);
                        }
                    }
                }
            break;
            case 'buttons':
                for (let button of obj.buttons) {
                    let newBtn = document.createElement("button");
                    newBtn.innerHTML = button['text'];
                    newForm.appendChild(newBtn);
                }
            break;
            default: 
            let deleteBtn = document.createElement("button");
            deleteBtn.innerHTML = 'Удалить форму';
            deleteBtn.addEventListener('click', function() {
                let formWrap = document.querySelector('.form-wrapper');
                let lastForm = document.getElementById('myForm');
                formWrap.removeChild(lastForm);
            })
            newForm.appendChild(deleteBtn);
            formWrap.appendChild(newForm);
        }
    }
  };

  // Читаем файл как текст
  reader.readAsText(file);
});