const truck = {
  type: {
    sprinter: 'SPRINTER',
    small_straight: 'SMALL STRAIGHT',
    large_straight: 'LARGE STRAIGHT',
  },
  status: {
    in_service: 'IS',
    on_load: 'OL',
  },
  payload: {
    sprinter: 1700,
    small_straight: 2500,
    large_straight: 4000,
  },
  dimensions: {
    sprinter: {
      length: 300,
      width: 250,
      height: 170,
    },
    small_straight: {
      length: 500,
      width: 250,
      height: 170,
    },
    large_straight: {
      length: 700,
      width: 350,
      height: 200,
    },
  },
};

module.exports = truck;
