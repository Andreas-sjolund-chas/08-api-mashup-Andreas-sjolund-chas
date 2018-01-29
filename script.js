var queryString = window.location.search;

var searchQuery = queryString.substring( queryString.indexOf('=') + 1 );


// Gets synonym words for the searched keyword from word.BigHugeLabsApi
function getWordsFromHugeLabs(search, callback) {
    var bigHugeLabs_key = '28d1c848e23e13d4722cec46813e8e81';
    var query = 'http://words.bighugelabs.com/api/2/' + bigHugeLabs_key + '/' + search + '/json';
    var error = 'no results found';
    
    var words = fetch(query, {
        method: 'GET'
    })
    .then(res => res.json())
    .then(res => {
        if (res) {
            let words = [];
            if (res['noun']['syn']) {
                let nounWords = res['noun']['syn'];
                words = words.concat(nounWords);
            } else {
                let nounWords = null;

            }
            if (res['verb']['syn']) {
                let verbWords = res['verb']['syn'];
                words = words.concat(verbWords);
            }
        
            renderWords(words);
        }
    })
    .catch(error => console.error('Error:', error));
};

getWordsFromHugeLabs(searchQuery);


// Renders a list of synonyms for the searched keyword
function renderWords(words) {
    let ul = document.querySelector('.wordlist');
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
    let buttons = document.querySelectorAll('#wordBtn');

        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                getImagesFromFlickr(e.target.value);
            });
    });

}


// Gets the images from FlickrApi when a synonym is clicked
function getImagesFromFlickr(words, callback) {

    var flickr_key = '7c1f028dbefb8fcfef42fd3891c69cec';
    var flickr_key_secret = 'a21b3246cabd27f2';

    var url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${flickr_key}&tags=${words}`;
    var searchMethod = '&tags=';
    var json = '&format=json';
    var callback = '&nojsoncallback=1';
    var error = 'no picture found for the searched word';

    var query = url + searchMethod + words + json + callback;
    
    result = fetch(query, {
        method: 'GET'
    })
    .then(res => res.json())
    .then(res => handlePhotos(res))
    .catch(error => console.error('Error: ', error));
};


// Renders the results from FlickrApi
function handlePhotos(photos) {
    
    let ul = document.querySelector('.photolist');
    const fragment = document.createDocumentFragment();

    photos['photos']['photo'].forEach(photo => {
        var farmId = photo['farm'];
        var serverId = photo['server'];
        var id = photo['id'];
        var secret = photo['secret'];
        
        var photoUrl = `https://farm${farmId}.staticflickr.com/${serverId}/${id}_${secret}.jpg`
        const li = document.createElement('li');
        const img = document.createElement('img');
        img.setAttribute("src", photoUrl);
        li.appendChild(img);
        fragment.appendChild(li);
    });
    ul.appendChild(fragment);

}