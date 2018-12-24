/*обработчик начинает свое выполнение только в тот момент, когда
построен DOM и загружены все скрипты*/
$('document').ready(function(){
   let animation =new actionsForTheMainPage('span', 'button', 'li');
    animation.clickActions();
});

/*класс для страницы*/
class actionsForTheMainPage {
    /*конструктор*/
    constructor(span, button, li) {
        this.span = span;
        this.button = button;
        this.li = li;
    }

    /*выполняются определенные действия на главной странице при нажатии на один из компонентов*/
    clickActions() {
        var article;

            /*при нажатии на span появляется/скрывается текст с инструкцией*/
            $(this.span).on('click',function () {
                $(".text").slideToggle(1500);
            });

            /*при нажатии на кнопку тегу body добавляется/удаляется класс "open"*/
            $(this.button).on('click', function(){
                    $('body').toggleClass('open');
            });

            /*при нажатии на первый элемент li (Запустить/Play) происходит перенаправление посетителя*/
            $(this.li).eq(0).on('click', function () {
                var textLi = $(this).text();
                if (textLi!='Назад'){
                    $('button').trigger('click');/*имитация нажатия на кнопку(button)*/
                    $(this).text('Назад');/*Текст в теге li меняется на "Назад"*/
                    $(this).attr('data-text', 'Back');/*добавляется атрибут data-text="Back"'*/
                    $('article').detach();/*тег удаляется, но данные о нем сохраняются*/

                    /*создания объектов для ввода значений*/
                    createElements('nav','<div class="data_input"><div class="field">'+
                                            '<input id="data" step="1" type="number" />' +
                                            '<label for="data"><span>Введите количество элементов</span></label>' +
                                            '<button id="ok">OK</button>' +
                                            '</div></div>');
                    var form = $('.data_input');
                    var amountOfNumbers; /*в данную переменную будет передваваться введеное значение*/

                    /*действия при отпускании клавиши клавиатуры*/
                    form.on('keyup', 'input', function (e) {
                        var $this = $(this),
                            input = $this.val();

                        /*если длина введенного значения больше 0 (т.е. если введен
                        хоть какой-нибудь символ), то выполняется действия в блоке ниже*/
                        if (input.length > 0) {
                            form.find('label').addClass('active');

                            /*если значение, введенное в input, больше 0*/
                            if (input>0){
                                form.find('button').addClass('active');

                                /*если нажата клавиша "Enter"*/
                                if (e.which === 13) {
                                    form.find('button').click();
                                    $this.blur();
                                }
                            }
                            $(this).addClass('active');
                        }else {
                            /*если в input ничего не вводилось, либо всё его содержимое стерли,
                            то выполяется данный блок*/
                            form.find('label').removeClass('active');
                            form.find('button').removeClass('active');
                            $(this).removeClass('active');
                        }
                    });

                    /*действия при нажатии на кнопку "ОК"*/
                    form.on('click', 'button.active', function (e) {
                        e.preventDefault;
                        amountOfNumbers=$('input').val();
                        $(this).addClass('full');
                        $(this).html('Спасибо!');
                        $('.data_input').fadeTo(1500, 0);
                        bubbleSorting(amountOfNumbers);
                    });
                }else{
                    /*Если в теге li содержится текст "Назад"*/
                    location.reload(); /*перезагрузка страницы*/
                }
            });

    }
}

/*функция для создания или востанновления(если был использован метод detach) объектов*/
function createElements(elementAfter,elements) {
    $(elementAfter).after(elements);
}

/*сортировка пузырьком*/
function bubbleSorting(numbers) {
    var array =[];/*массив для сортировки*/
    var i, randomNumber,timeout,step, shiftOfNumber;
    var firstIndex,secondIndex,firstBubble,secondBubble;

    /*создание необходмых элементов для удобной работы с сортировкой*/
    createElements('.data_input','<div class="block">' +
        '<div class="btns">' +
            '<button class="button randomNumbers">Сгенерировать</button>' +
            '<button class="button sorting" style="display: none">Сортировать</button>'+
        '</div>' +
        '<h3>Массив до сортировки</h3>'+
        '<div class="beforeSorting">' +
        '</div>'+
        '<h3 class="newsort">Сортировка</h3>' +
        '<div class="afterSorting">' +
        '</div>'+
        '</div>');

    /*при нажатии на кнопку "Сгенерировать"*/
    $('.randomNumbers').on('click',function () {
        $('.sorting').show('slow'); //кнопка "Сортировать"  становится видимой
        $('.beforeSorting, .afterSorting').html('');
        clearTimeout(timeout); //отмена выполнения таймера

        //Генерация случайных чисел и появление пузырей со случайными числами
        for (i = 0; i < numbers; i++) {
            randomNumber = Math.floor(Math.random() * 100) + 1;//случайное число от 1 до 100
            $('.beforeSorting').append('<div class="ball bubble"><span class="number">' + randomNumber + '</span></div>');
            $('.afterSorting').append('<div class="ball bubble"><span class="number">' + randomNumber + '</span></div>');
            array[i] = randomNumber; //заполнение массива случайными числами
        }
    });

    /*при нажатии на кнопку "Сортировать"*/
    $('.sorting').on('click',function () {
        $(this).hide('slow'); //кнопка "Сортировать" исчезает
        $('.randomNumbers').hide('slow');////кнопка "Сгенерировать" исчезает
        $('.menu-toggle').prop('disabled',true);//во время выполнения сортировки кнопка для открытия/закрытия меню становится не активна
        step = 1;
        /*функция сортировки*/
        function sorting() {
            //проверка на количество выполненных шагов (выполняется для того,чтобы в нужный момент остановить сортировку)
            if(step < numbers+1){
                step++;
                i = 1; //начальное значение для внутреннего цикла (для проходов по каждому из чисел)
                (function() {
                    if (i < numbers) { //проверка значения внутреннего цикла
                        if( array[i] < array[i-1] ){ //сравниваем текущее и предыдущее число массива
                            //меняем числа в массиве
                            shiftOfNumber = array[i];
                            array[i] = array[i-1];
                            array[i-1] = shiftOfNumber;
                            firstIndex = i; //сохраняем индекс текущего элемента массива
                            secondIndex = i-1; //сохраняем индекс предыдущего элемента массива
                            //находим пузыри по их индексам
                            firstBubble = $('.afterSorting .ball:eq('+firstIndex+')');
                            secondBubble = $('.afterSorting .ball:eq('+secondIndex+')');
                            firstBubble.swap(secondBubble); //меняем текущий пузырь с предыдущим


                            timeout = setTimeout(arguments.callee, 1000);
                        }else{
                            timeout = setTimeout(arguments.callee, 0);
                        }
                        i++;
                    }else{
                        sorting();  //запускаем функцию сортировки
                    }
                })();
            }else{
                clearTimeout(timeout); //отмена выполнения таймера
                $('.newsort').text('Сортировка окончена');
                $('.menu-toggle').prop('disabled',false);//во время окончания сортировки кнопка открытия/закрытия меню становится активна
            }
        }
        sorting();//запуск функции сортировки
    });
}



