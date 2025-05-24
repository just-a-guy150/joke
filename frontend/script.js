const url = 'http://localhost:3000/jokes'

const jokesDiv = document.querySelector('.jokes');

async function getJokes() {
    const response = await fetch(url);
    data = await response.json();
    console.log(data);
    return data;
}

function renderJokes(jokeData) {
    const {
        content,
        likes,
        dislikes
    } = jokeData

    const html = `
        <div class="joke">
            <div class="joke-content">
                <p>${content}</p>
                <div class="joke-actions">
                    <div class="likes">
                        <span>${likes}</span>

                        <button type="button" class="joke-like joke__action">
                            <span class="material-symbols-outlined">
                                thumb_up
                            </span>
                        </button>
                    </div>
                    <div class="dislikes">
                        <span>${dislikes}</span>
                        <button type="button" class="joke-dislike joke__action">
                            <span class="material-symbols-outlined">
                                thumb_down
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `

    jokesDiv.insertAdjacentHTML('beforeend', html);
}

getJokes().then( data => {
    data.forEach(renderJokes);
})