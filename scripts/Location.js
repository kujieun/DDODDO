// Location.js

// 이미지 파일 경로를 require로 불러오기
const JeongDongJin = require('../image/ar/place/JeongDongJin.png');
const noodle = require('../image/ar/place/noodle.png');
const eateryg = require('../image/ar/place/eateryg.png');
const bori = require('../image/ar/place/bori.png');
const sun = require('../image/ar/place/sun.png');
const santorini = require('../image/ar/place/santorini.png');
const bosa = require('../image/ar/place/bosa.png');

const locations = [
  {
    category: '관광지',
    places: [
      {
        name: 'JeongDongJin',
        image: JeongDongJin,
        coordinates: {
          latitude: 37.6900911,
          longitude: 129.0344160,
        },
      },
      {
        name: 'sun',
        image: sun,
        coordinates: {
          latitude: 37.7866796,
          longitude: 128.8851259,
        },
      },
    ],
  },
  {
    category: '식당',
    places: [
      {
        name: 'noodle',
        image: noodle,
        coordinates: {
          latitude: 37.7215947,
          longitude: 128.8817995,
        },
      },
      {
        name: 'bori',
        image: bori,
        coordinates: {
          latitude: 37.7177515,
          longitude: 128.8797010,
        },
      },
      {
        name: 'eateryg',
        image: eateryg,
        coordinates: {
          latitude: 37.7183532,
          longitude: 128.8808296,
        },
      },
    ],
  },
  {
    category: '카페',
    places: [
      {
        name: 'santorini',
        image: santorini,
        coordinates: {
          latitude: 37.7707270,
          longitude: 128.9501998,
        },
      },
      {
        name: 'bosa',
        image: bosa,
        coordinates: {
          latitude: 37.7720449,
          longitude: 128.9478398,
        },
      },
    ],
  },
];

export default locations;
