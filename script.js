import './src/styles/styles.css';

let button = document.querySelector('.searchBtn');

button.addEventListener('click', function(event) {
    event.preventDefault();
    let input = document.querySelector('.searchInput');
    getWordsFromHugeLabs(input.value);
    input.value = "";
});

// Gets synonym words for the searched keyword from word.BigHugeLabsApi
function getWordsFromHugeLabs(search) {
    getImagesFromFlickr(search);
    
    var bigHugeLabs_key = process.env.WORDLAB_KEY;
    var query = 'http://words.bighugelabs.com/api/2/' + bigHugeLabs_key + '/' + search + '/json';
    var error = 'no results found';
    
    var words = fetch(query, {
        method: 'GET'
    })
    .then(res => res.json())
    .then(res => {
        if (res) {
            let words = [];
            if (res['noun']) {
                let nounWords = res['noun']['syn'];
                words = words.concat(nounWords);
            } else {
                let nounWords = null;

            }
            if (res['verb']) {
                let verbWords = res['verb']['syn'];
                words = words.concat(verbWords);
            }
            
            renderWords(words);
        }
    })
    .catch((err) => {
        let ul = document.querySelector('.wordlist');
        ul.innerHTML = "";
        let msgHolder = document.createElement('h5');
        let msg = document.createTextNode("No synonyms found for the searched word");
        msgHolder.appendChild(msg);
        ul.insertBefore(msgHolder, ul.childNodes[0]);
        errorHandler(error);
    });
};

// Renders a list of synonyms for the searched keyword
function renderWords(words) {
    let ul = document.querySelector('.wordlist');
    let msgHolder = document.createElement('h5');
    let msg = document.createTextNode("You also might wanna search for");
    msgHolder.appendChild(msg);
    
    ul.innerHTML = "";
    const fragment = document.createDocumentFragment();
    
    words.forEach(word => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.setAttribute("id", "wordBtn");
        btn.setAttribute("value", word);
        btn.innerHTML = word;
        li.appendChild(btn);
        fragment.appendChild(li);
    });

    ul.appendChild(fragment);
    ul.insertBefore(msgHolder, ul.childNodes[0]);
    let buttons = document.querySelectorAll('#wordBtn');

        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                getWordsFromHugeLabs(e.target.value);
            });
    });

}


// Gets the images from FlickrApi when a synonym is clicked
function getImagesFromFlickr(words, callback) {

    var flickr_key = process.env.FLICKR_KEY;

    var url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${flickr_key}&text=${words}`;
    var safe = '&safe_search=1';
    var json = '&format=json';
    var callback = '&nojsoncallback=1';
    var sort = '&sort=relevance';
    var tags = `&tags=${words}`;
    var extras = '&extras=owner_name, url_m';

    var query = url + json + callback + safe + sort + tags + extras;
    
    var error = 'no pictures found for the searched word';
    fetch(query, {
        method: 'GET'
    })
    .then(res => res.json())
    .then(res => {
        
        handlePhotos(res);
        if(res['photos']['total'] == 0) {
            errorHandler(error);    
        };
    })
    .catch(err => console.error('Get images error: ', error))
    .catch((err) => {
        errorHandler(error);
    });
};

// Renders the results from FlickrApi
function handlePhotos(photos) {
    
    let content = document.querySelector('.errorMsgBox');
    content.innerHTML = "";

    let ul = document.querySelector('.photolist');

    const fragment = document.createDocumentFragment();

    photos['photos']['photo'].forEach(photo => {
        var farmId = photo['farm'];
        var serverId = photo['server'];
        var id = photo['id'];
        var secret = photo['secret'];
        var owner = photo['ownername'];

        var ownerUrl = 'https://www.flickr.com/photos/' + photo['owner'];
        var photoUrl = `https://farm${farmId}.staticflickr.com/${serverId}/${id}_${secret}.jpg`

        const li = document.createElement('li');
        const a = document.createElement('a');
        const img = document.createElement('img');
        const p = document.createElement('p');

        p.innerHTML = 'Uploaded by: ' + owner;
        a.href = ownerUrl;
        a.target = '_blank';
        img.setAttribute("src", photoUrl);
        img.setAttribute("class", "img-animation");
        li.setAttribute("class", "photo");
        li.appendChild(p);
        li.appendChild(a);
        a.appendChild(img)
        fragment.appendChild(li);
    });
    ul.innerHTML = "";
    ul.appendChild(fragment);
    
}

function errorHandler(error) {
    let content = document.querySelector('.errorMsgBox');
    content.innerHTML = "";
    let message = `<p class="errorMsg">${error}</p>`;
    content.insertAdjacentHTML('afterbegin', message);
}