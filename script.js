//shuffling cards
function shuffleCards() {
    // getting all cards
    // need to spread it in to make it an array
    const cards = [...document.getElementsByClassName('card-container')];

    for (const card of cards) {
        card.remove();
    }

    var shuffledCards = shuffle(cards);

    const a = shuffledCards.slice(0, 6);
    const b = shuffledCards.slice(6, 12);
    const c = shuffledCards.slice(12, 18);

    for (const card of a) {
        document.querySelector("#first-row").appendChild(card);
    }

    for (const card of b) {
        document.querySelector("#second-row").appendChild(card);
    }

    for (const card of c) {
        document.querySelector("#third-row").appendChild(card);
    }
}

// fisher yates shuffle
function shuffle(array) {
    var currentIndex = array.length;
    var temporaryValue;
    var randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};


window.onload = function () {
    shuffleCards();

    var welcomeAudio = document.getElementById('welcome').play();
    if (welcomeAudio !== undefined) {
        welcomeAudio.then(_ => {
            // Autoplay started!
        }).catch(error => {
            // Autoplay was prevented.
        });
    }

    var card = document.getElementsByClassName('flip-card');
    var flipCount = 0;
    var cardAltArr = [];

    var scoreCountArea = document.querySelector('.current-score');
    var scoreCounter = document.createElement('span');
    scoreCountArea.appendChild(scoreCounter)
    var scoreCount = 1;



    for (var i = 0; i < card.length; i++) {
        card[i].addEventListener('click', function (e) {

            //limit flipping cards to 2 cards at a time 
            if (flipCount < 2 && this.classList.contains('is-match') === false) {
                if (this.classList.contains('is-flipped') === false) {
                    this.classList.toggle('is-flipped');
                    flipCount += 1;

                    var cardAlt = e.target.alt;
                    cardAltArr.push(cardAlt);

                    scoreCounter.innerText = scoreCount;
                    scoreCount += 1;
                }

                var cards = document.getElementsByClassName('is-flipped');
                // make a copy of cards to switch out classes in cards array later 
                var cardsCopy = [...cards];

                //flipCount only changes and checks itself with each click
                //compare cardAltArr to avoid clicking a 3rd time
                if (cardAltArr.length === 2) {
                    if (cardAltArr[0] === cardAltArr[1]) {
                        flipCount -= 2;
                        cardAltArr = [];

                        //replacing is-flipped with is-match to avoid removing matched cards later
                        for (var k = 0; k < cardsCopy.length; k++) {
                            cardsCopy[k].classList.add('is-match');
                            cardsCopy[k].classList.remove('is-flipped');
                        }

                    } else {
                        cardAltArr = [];
                        //flip non matching cards back onto their back
                        setTimeout(
                            function () {
                                for (var j = 0; j < cardsCopy.length; j++) {
                                    cardsCopy[j].classList.remove('is-flipped');
                                }
                                flipCount -= 2;
                            }, 1200);
                    }
                }

            } else {
                return false;
            }

            //victory image and audio appears after all matches are found
            if (allMatches.length === 18) {
                var victoryAudio = document.getElementById('victory').play();
                if (victoryAudio !== undefined) {
                    victoryAudio.then(_ => {
                        // Autoplay started!
                    }).catch(error => {
                        // Autoplay was prevented.
                    });
                }

                var victoryImage = document.createElement('img');
                victoryImage.setAttribute('src', 'victory-symbol.png');
                var containerTransition = document.querySelector('.container');
                containerTransition.appendChild(victoryImage);
                victoryImage.style.position = 'fixed';
                victoryImage.style.top = '50%';
                victoryImage.style.left = '50%';
                victoryImage.style.transform = 'translate(-50%, -50%)';

            };

        });
    }

    //saving best score onto local storage 

    var allMatches = document.getElementsByClassName('is-match');
    var bestScoreArea = document.querySelector('.best-score');
    var bestScoreCounter = document.createElement('span');
    bestScoreArea.appendChild(bestScoreCounter);
    bestScoreCounter.innerText = localStorage.getItem('bestScore');

    window.addEventListener('beforeunload', function () {
        if (allMatches.length === 18) {
            //scoreCount - 1 or else bestScore would be offset by 1 
            localStorage.setItem('bestScore', scoreCount - 1);
        }
    })

}


