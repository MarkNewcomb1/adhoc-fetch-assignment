import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

// Your retrieve function plus any additional functions go here ...

export const retrieve = (queryObject = {}) => {
    const limit = 10;
    const page = queryObject.page || 1;
    const url = URI(window.path).addQuery('limit', limit+1).addQuery('offset', (page -1) * limit)
    if (queryObject.colors && queryObject.colors.length > 0) url.addQuery('color[]', queryObject.colors);
    return fetch(url)
        .then((res) => {
            return res.ok ? res.json() : console.log('Error: ', res.status);
        })
        .then((list) => {
            let last = list.length <= limit;
            if (!last) {
                list.splice(limit, 1);
            }
            const primary = ['red', 'blue', 'yellow'];
            list.forEach((i) => i.isPrimary = primary.includes(i.color));

            let transformResponse = {};
            transformResponse.ids = list.map(i => i.id);
            transformResponse.open = list.filter(i => i.disposition === 'open');
            transformResponse.closedPrimaryCount = list.filter(i => i.disposition === 'closed' && i.isPrimary === true).length;
            transformResponse.nextPage = last ? null : page + 1;
            transformResponse.previousPage = page == 1 ? null : page - 1;
            return transformResponse;
        })
        .catch(err => console.log(`error: ${err}`))
}

export default retrieve;
