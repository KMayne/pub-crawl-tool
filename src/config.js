module.exports = {
  // URL to Mongo database
  mongoURL: 'mongodb://localhost/pubcrawl',
  // API key for Google Maps (see https://developers.google.com/maps/documentation/javascript/get-api-key for details)
  googleMapsAPIKey: '[Google Maps API Key Here]',
  // The URL the app will be accessible for - this is only for convenience for copying the admin key
  serverURL: '[SERVER-URL]',
  route: [{
        name: 'Station VK',
        stationName: 'Sloane Square',
        time: new Time(9),
        walking: false,
        geolocation: new Coords(51.492034, -0.156686)
      }, {
        name: 'Wetherspoons Victoria Station',
        stationName: 'Victoria',
        notes: 'Breakfast',
        time: new Time(9, 15),
        walking: false,
        geolocation: new Coords(51.495124, -0.144316)
      }, {
        name: 'The Albert',
        stationName: 'St James\' Park' ,
        time: new Time(10),
        walking: true,
        geolocation: new Coords(51.497743, -0.135584)
      },{
        name: 'St Stephen\'s Tavern',
        stationName: 'Westminster',
        time: new Time(10, 30),
        walking: true,
        geolocation: new Coords(51.501178, -0.125605)
      }, {
        name: 'Lord Moon of the Mall',
        stationName: 'Embankment',
        time: new Time(11),
        walking: false,
        geolocation: new Coords(51.506494, -0.127379)
      }, {
        name: 'Ye Olde Cock Tavern',
        stationName: 'Temple',
        time: new Time(11, 30),
        walking: false,
        geolocation: new Coords(51.513760, -0.110495)
      },{
        name: 'The Blackfriar',
        stationName: 'Blackfriars',
        time: new Time(12),
        walking: false,
        geolocation: new Coords(51.512141, -0.103724)
      }, {
        name: 'The Sugar Loaf',
        stationName: 'Mansion House',
        time: new Time(12, 30),
        walking: true,
        geolocation: new Coords(51.512308, -0.092843)
      }, {
        name: 'Sir John Hawkshaw',
        stationName: 'Cannon Street',
        notes: 'Lunch',
        time: new Time(13),
        walking: true,
        geolocation: new Coords(51.510963, -0.090074)
      },{
        name: 'The Monument',
        stationName: 'Monument',
        time: new Time(14),
        walking: false,
        geolocation: new Coords(51.510086, -0.086215)
      }, {
        name: 'The Liberty Bounds',
        stationName: 'Tower Hill',
        time: new Time(14, 30),
        walking: false,
        geolocation: new Coords(51.509740, -0.078591)
      }, {
        name: 'Hoop and Grapes',
        stationName: 'Aldgate',
        time: new Time(15),
        walking: false,
        geolocation: new Coords(51.514242, -0.074139)
      },{
        name: 'Hamilton Hall',
        stationName: 'Liverpool Street',
        time: new Time(15, 30),
        walking: true,
        geolocation: new Coords(51.517481, -0.080949)
      }, {
        name: 'The Globe',
        stationName: 'Moorgate',
        time: new Time(16),
        walking: false,
        geolocation: new Coords(51.517694, -0.088744)
      }, {
        name: 'The Sutton Arms',
        stationName: 'Barbican',
        time: new Time(16, 30),
        walking: true,
        geolocation: new Coords(51.520705, -0.098194)
      },{
        name: 'The Castle',
        stationName: 'Farringdon',
        time: new Time(17),
        walking: false,
        geolocation: new Coords(51.520281, -0.104275)
      }, {
        name: 'O\'Neill\'s',
        stationName: 'King\'s Cross St Pancras',
        time: new Time(17, 30),
        walking: false,
        geolocation: new Coords(51.528939, -0.126169)
      }, {
        name: 'The Jeremy Bentham',
        stationName: 'Euston Square',
        time: new Time(18),
        walking: false,
        geolocation: new Coords(51.523502, -0.135567)
      },{
        name: 'The Albany',
        stationName: 'Great Portland Street',
        time: new Time(18, 30),
        walking: false,
        geolocation: new Coords(51.523386, -0.143974)
      }, {
        name: 'Metropolitan Bar',
        stationName: 'Baker Street',
        notes: 'Dinner',
        time: new Time(19),
        walking: false,
        geolocation: new Coords(51.522521, -0.156842)
      }, {
        name: 'The Green Man',
        stationName: 'Edgware Road',
        time: new Time(20),
        walking: false,
        geolocation: new Coords(51.520365, -0.170386)
      },{
        name: 'Pride of Paddington',
        stationName: 'Paddington',
        time: new Time(20, 30),
        walking: false,
        geolocation: new Coords(51.515016, -0.176348)
      }, {
        name: 'Bayswater Arms',
        stationName: 'Bayswater',
        time: new Time(21),
        walking: false,
        geolocation: new Coords(51.512583, -0.187809)
      }, {
        name: 'Old Swan',
        stationName: 'Notting Hill Gate',
        time: new Time(21, 30),
        walking: false,
        geolocation: new Coords(51.508812, -0.194948)
      },{
        name: 'Prince of Wales',
        stationName: 'High Street Kensington',
        time: new Time(22),
        walking: false,
        geolocation: new Coords(51.502353, -0.190899)
      }, {
        name: 'Stanhope Arms',
        stationName: 'Gloucester Road',
        time: new Time(22, 30),
        walking: false,
        geolocation: new Coords(51.494131, -0.181987)
      }, {
        name: 'FiveSixEight',
        stationName: 'South Kensington',
        time: new Time(23),
        walking: false,
        geolocation: new Coords(51.500411, -0.178039)
      }]
};
