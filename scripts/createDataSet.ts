import fetch from 'node-fetch';
import path from "path";
import dotenv from "dotenv";
import { get } from 'http';
import _ from 'lodash';

console.log(__dirname);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const DISCOVER_MOVIES_API_URL = 'https://api.themoviedb.org/3/discover/movie?include_adult=true&include_video=true&language=en-US&page={pageNumber}';
const DISCOVER_TV_API_URL = 'https://api.themoviedb.org/3/discover/tv?include_adult=true&include_video=true&language=en-US&page={pageNumber}';
const MOVIES_GENRES_API_URL = 'https://api.themoviedb.org/3/genre/movie/list?language=en-US';
const TV_GENRES_API_URL = 'https://api.themoviedb.org/3/genre/tv/list?language=en-US';
const API_READ_TOKEN = process.env.TMDB_API_READ_TOKEN;
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
const getContent = (url = "" as string, pageNumber = 0 as number) => {
    if (pageNumber > 0) {
        url = url.replace('{pageNumber}', pageNumber.toString());
    }

    return fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': "Bearer "+ API_READ_TOKEN
        }
      })
    .then((res: { json: () => any; }) => {
        return res.json();
    })
}

function addTypeAndSetDatesToUTC(data = [] as any, type = "" as string) {
    data.forEach((item: any) => {
        let time = new Date(item.release_date).toUTCString()
        item.type = type;
        item.release_date = Date.parse(time);
    });
}

function addGenres(data = [] as any, genres = {} as any) {
    data.forEach((item: any) => {
        item.genres = item.genre_ids.map((id: any) => {
            return genres.genres.find((genre: any) => genre.id === id).name
        });
    });
}

getContent(MOVIES_GENRES_API_URL).then((moviesGenres: any) => {
    getContent(TV_GENRES_API_URL).then((tvGenres: any) => {
        Promise.all([getContent(DISCOVER_MOVIES_API_URL, 1), getContent(DISCOVER_MOVIES_API_URL, 2), getContent(DISCOVER_MOVIES_API_URL, 3), getContent(DISCOVER_MOVIES_API_URL, 4), getContent(DISCOVER_MOVIES_API_URL, 5)]).then((values) => {
            let movies = [];
            values.forEach((response: any) => {
                movies = [...movies, ...response.results];
            });
            Promise.all([getContent(DISCOVER_TV_API_URL, 1), getContent(DISCOVER_TV_API_URL, 2), getContent(DISCOVER_TV_API_URL, 3), getContent(DISCOVER_TV_API_URL, 4), getContent(DISCOVER_TV_API_URL, 5)]).then((values) => {
                let tvShows = [];
                values.forEach((response: any) => {
                    tvShows = [...tvShows, ...response.results];
                });
                console.log(movies);
                addTypeAndSetDatesToUTC(movies, "movie");
                addTypeAndSetDatesToUTC(tvShows, "series");
                addGenres(movies, moviesGenres);
                addGenres(tvShows, tvGenres);
                let content = [
                    ...movies,
                    ...tvShows
                ];

                content.forEach((item: TMBDContent) => {
                    if (item.backdrop_path !== null) {
                        item.backdrop_path = IMAGE_BASE_URL + 'original' + item.backdrop_path;
                    } else {
                        item.backdrop_path = ""
                    }
                    item.poster_path = IMAGE_BASE_URL + 'original' + item.poster_path;

                    if (_.isEmpty(item["name"]) && !_.isEmpty(item["title"])) {
                        item["name"] = item["title"];
                        delete item["title"];
                    }
                    if (_.isEmpty(item["original_name"]) && !_.isEmpty(item["original_title"])) {
                        item["original_name"] = item["original_title"];
                        delete item["original_title"];
                    }
                });
                let contentPayload = {
                    data: content
                }
                var fs = require('fs');
                fs.writeFile(path.resolve(__dirname, "../test-project/assets/sampleData.json"), JSON.stringify(contentPayload, null, 4), function(err: any) {
                    if (err) {
                        console.log(err);
                    }
                });
            });
        });
    });
});

type TMBDContent = {
    id: number;
    name: string;
    original_name: string;
    first_air_date: string;
    adult: boolean;
    backdrop_path: string;
    poster_path: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    release_date: string|number;
    type: string;
}
