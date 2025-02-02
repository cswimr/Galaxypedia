document.addEventListener('DOMContentLoaded', function () {
    const searchbar = document.getElementById('searchbar');
    let results = document.getElementById('results');

    searchbar.addEventListener('input', async function () {
        console.log(searchbar.value);

        let response = await fetch('https://localhost:9200/galaxypedia/_search', {
            method: 'POST',
            body: JSON.stringify({
                query: {
                    multi_match: {
                        query: searchbar.value,
                        type: "bool_prefix",
                        fuzziness: "AUTO",
                        fields: ['title^4', 'aliases^3', 'content^2', 'categories']
                    }
                }
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ZWxhc3RpYzpzdWdvbmRlc2U='
            }
        });

        let data = await response.json();

        console.log(JSON.stringify(data, null, 2));

        results.innerHTML = '';

        let hits = data.hits.hits;
        var i = 0;
        for (let hit of hits) {
            if (i >= 5) {
                break;
            }
            let a = document.createElement('a');
            a.href = (window.location.origin + hit._source.uri).replace(/\s+/g, '-').replace('(', '').replace(')', '');
            a.textContent = hit._source.title;
            results.appendChild(a);
            results.appendChild(document.createElement('br'));
            i++;
        }

        if (hits.length > 0) {
            results.appendChild(document.createElement('hr'));
        }
    });
});
