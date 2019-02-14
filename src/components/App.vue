<template>
  <main id="app">
    <p v-if="!registered" class="nonregistered-message">
      Please request a login URL from Kian
    </p>
    <nav v-if="registered">
      <a href="/route">Route</a>
      <a href="/report">Report</a>
      <a href="/scoreboard">Scores</a>
      <a href="/admin">Admin</a>
    </nav>
    <welcome-page v-if="registered && page === 'welcome'" :route="route" @checkIn="checkIn" :currentUser="currentUser"/>
    <route-page v-if="registered && (page === 'route' || page === '')" :route="route" :users="users" :currentUser="currentUser" @checkIn="checkIn" @removeCheckIn="removeCheckIn" />
    <incident-report-form v-if="registered && page === 'report'"
    :users="users"
    :offences="offences"
    @addUserOffence="addUserOffence"
    :reportSuccess="reportSuccess"
    />
    <scoreboard-page v-if="registered && page === 'scoreboard'" :users="users" :currentUserID="currentUserID"/>
    <user-detail v-if="registered && page === 'users'" :user="selectedUser"
    :isCurrentUser="userID === currentUserID"
    @deleteOffence="deleteUserOffence" />
    <admin-page v-if="registered && page === 'admin'"
    :users="users"
    :offences="offences"
    @add-user="addUser"
    @modify-user="modifyUser"
    @add-offence="addOffence"
    @modify-offence="modifyOffence"
    />
  </main>
</template>

<script>
import RoutePage from './RoutePage.vue';
import Scoreboard from './Scoreboard.vue';
import IncidentReportForm from './IncidentReportForm.vue';
import UserDetail from './UserDetail.vue';
import Admin from './Admin.vue';
import WelcomePage from './WelcomePage.vue';

const API_BASE_URL = '/api';

export default {
  name: 'app',
  components: {
    'route-page': RoutePage,
    'scoreboard-page': Scoreboard,
    'admin-page': Admin,
    'incident-report-form': IncidentReportForm,
    'welcome-page': WelcomePage,
    'user-detail': UserDetail
  },

  created() {
    const query = location.search.substring(1);
    if (query.substr(0, 4) === 'key=') {
      this.setKey(query.substring(4));
    }
    // Retrieve data from server
    this.refreshData()
      .then(() => {
        if (!this.currentUser) throw new Error("User not found");
        console.log('Current User =', this.currentUser);
      });
  },

  computed: {
    registered() {
      return !!this.getKey();
    },

    selectedUser() {
      const NOT_FOUND_USER = {
        name: 'No user found',
        imageURL: '/images/user.png',
        points: 0
      };
      return this.users.find(u => u.id == this.userID) || NOT_FOUND_USER;
    },

    currentUser() {
      return this.users ? this.users.find(u => u.id === this.currentUserID) : null;
    }
  },

  methods: {
    getKey() {
      return localStorage.getItem('loginKey');
    },

    setKey(key) {
      localStorage.setItem('loginKey', key);
    },

    addURLKey(url) {
      return url + '?key=' + this.getKey();
    },

    checkIn({ pubName, redirect }) {
      this.sendData(`/users/${this.currentUserID}/checkIn`, { pubName })
        .then(() => this.refreshData())
        .then(() => { if (redirect) window.location.href = '/'; });
    },

    removeCheckIn({ pubName }) {
      this.sendData(`/users/${this.currentUserID}/checkIn/${pubName}`, null, 'DELETE')
        .then(() => this.refreshData());
    },

    addUserOffence({ userID, offenceID }) {
      this.sendData(`/users/${userID}/offences/`, { offenceID })
        .then(() => {
          const points = this.users.find(u => u.id == userID).points + 0;
          this.refreshData().then(() => {
            this.reportSuccess = points !== this.users.find(u => u.id == userID).points
          });
        });
    },

    deleteUserOffence({ userID, userOffenceID }) {
      this.sendData(`/users/${userID}/offences/${userOffenceID}`, null, 'DELETE')
        .then(() => this.refreshData());
    },

    addUser(user) {
      this.sendData(`/users/`, user)
        .then(() => this.refreshData());
    },

    modifyUser({ userID, user }) {
      this.sendData(`/users/${userID}`, user, 'PATCH')
        .then(() => this.refreshData());
    },

    addOffence(offence) {
      this.sendData(`/offences/`, offence)
        .then(() => this.refreshData());
    },

    modifyOffence({ offenceID, offence }) {
      this.sendData(`/offences/${offenceID}`, offence, 'PATCH')
        .then(() => this.refreshData());
    },

    sendData(url, data, method = 'POST') {
      return fetch(API_BASE_URL + this.addURLKey(url), {
        method,
        body: data !== null ? JSON.stringify(data) : null,
        headers: {
          'Accept': 'application/json', // receive json
          'Content-Type': 'application/json' // send json
        }
      }).catch(err => alert('Error occured: ' + err));
    },

    refreshData(silent) {
      return fetch(this.addURLKey(API_BASE_URL + '/data'))
        .then(function (response) {
          if (response.headers.get('Content-Type').split(';')[0] !== 'application/json') {
            throw new Error('Response content-type was not JSON');
          }
          return response.json();
        }).then(receivedData => {
          this.currentUserID = receivedData.userID;
          this.users = receivedData.users;
          this.offences = receivedData.offences;
        }).catch(err => {
          if (!silent) alert('Error occurred downloading data: ' + err);
        });
    }
  },

  data() {
    const urlParts = location.pathname.split('/');
    return {
      page: urlParts[1],
      userID: parseInt(urlParts[2]),
      currentUserID: null,
      users: [],
      offences: [],
      reportSuccess: false,
      route: [{
        name: 'Strawpedo a VK outside the station',
        stationName: 'Sloane Square',
        time: new Time(9),
        walking: false,
        geolocation: new Coords()
      }, {
        name: 'Wetherspoons Victoria Station',
        stationName: 'Victoria',
        notes: 'Breakfast',
        time: new Time(9, 15),
        walking: false,
        geolocation: new Coords()
      }, {
        name: 'The Albert',
        stationName: 'St James\' Park' ,
        time: new Time(10),
        walking: true,
        geolocation: new Coords()
      },{
        name: 'St Stephen\'s Tavern',
        stationName: 'Westminster',
        time: new Time(10, 30),
        walking: true,
        geolocation: new Coords()
      }, {
        name: 'Lord Moon of the Mall',
        stationName: 'Embankment',
        time: new Time(11),
        walking: false,
        geolocation: new Coords()
      }, {
        name: 'Ye Olde Cock Tavern',
        stationName: 'Temple',
        time: new Time(11, 30),
        walking: false,
        geolocation: new Coords()
      },{
        name: 'The Blackfriar',
        stationName: 'Blackfriars',
        time: new Time(12),
        walking: false,
        geolocation: new Coords()
      }, {
        name: 'The Sugarloaf',
        stationName: 'Mansion House',
        time: new Time(12, 30),
        walking: true,
        geolocation: new Coords()
      }, {
        name: 'Sir John Hawkshaw',
        stationName: 'Cannon Street',
        notes: 'Lunch',
        time: new Time(13),
        walking: true,
        geolocation: new Coords()
      },{
        name: 'The Monument',
        stationName: 'Monument',
        time: new Time(14),
        walking: false,
        geolocation: new Coords()
      }, {
        name: 'The Liberty Bounds',
        stationName: 'Tower Hill',
        time: new Time(14, 30),
        walking: false,
        geolocation: new Coords()
      }, {
        name: 'Hoop and Grapes',
        stationName: 'Aldgate',
        time: new Time(15),
        walking: false,
        geolocation: new Coords()
      },{
        name: 'Hamilton Hall',
        stationName: 'Liverpool Street',
        time: new Time(15, 30),
        walking: true,
        geolocation: new Coords()
      }, {
        name: 'The Globe',
        stationName: 'Moorgate',
        time: new Time(16),
        walking: false,
        geolocation: new Coords()
      }, {
        name: 'The Sutton Arms',
        stationName: 'Barbican',
        time: new Time(16, 30),
        walking: true,
        geolocation: new Coords()
      },{
        name: 'The Castle',
        stationName: 'Farringdon',
        time: new Time(17),
        walking: false,
        geolocation: new Coords()
      }, {
        name: 'O\'Neill\'s',
        stationName: 'King\'s Cross St Pancras',
        time: new Time(17, 30),
        walking: false,
        geolocation: new Coords()
      }, {
        name: 'The Jeremy Bentham',
        stationName: 'Euston Square',
        time: new Time(18),
        walking: false,
        geolocation: new Coords()
      },{
        name: 'The Albany',
        stationName: 'Great Portland Street',
        time: new Time(18, 30),
        walking: false,
        geolocation: new Coords()
      }, {
        name: 'Metropolitan Bar',
        stationName: 'Baker Street',
        notes: 'Dinner',
        time: new Time(19),
        walking: false,
        geolocation: new Coords()
      }, {
        name: 'The Green Man',
        stationName: 'Edgware Road',
        time: new Time(20),
        walking: false,
        geolocation: new Coords()
      },{
        name: 'Pride of Paddington',
        stationName: 'Paddington',
        time: new Time(20, 30),
        walking: false,
        geolocation: new Coords()
      }, {
        name: 'Bayswater Arms',
        stationName: 'Bayswater',
        time: new Time(21),
        walking: false,
        geolocation: new Coords()
      }, {
        name: 'Old Swan',
        stationName: 'Notting Hill Gate',
        time: new Time(21, 30),
        walking: false,
        geolocation: new Coords()
      },{
        name: 'Prince of Wales',
        stationName: 'High Street Kensington',
        time: new Time(22),
        walking: false,
        geolocation: new Coords()
      }, {
        name: 'Stanhope Arms',
        stationName: 'Gloucester Road',
        time: new Time(22, 30),
        walking: false,
        geolocation: new Coords()
      }, {
        name: 'FiveSixEight',
        stationName: 'South Kensington',
        time: new Time(23),
        walking: false,
        geolocation: new Coords()
      },]
    };
  }
}

class Time {
  constructor(hour, minute = 0) {
    if (!(hour >= 0 && hour < 24 && minute >= 0 && minute < 60)) throw new Error("Invalid time");
    this.hour = hour;
    this.minute = minute;
  }

  format() {
    return pad(this.hour) + ':' + pad(this.minute);
  }

  passed() {
    const now = new Date();
    return now.getHours() > this.hour || now.getHours() === this.hour && now.getMinutes() > this.minute;
  }
}

class Coords {
  constructor() {}
}

function pad(num) {
  if (num < 10) return '0' + num;
  return String(num);
}
</script>

<style>
nav {
  display: flex;
  justify-items: stretch;
}

header > a, nav > a {
  color: black;
}

nav > a {
  display: flex;
  justify-content: center;
  align-items: center;  
  flex: 1 1;
  text-align: center;
  font-size: 24px;
  padding: 8px;
  background-color: #FAC05E;
}

nav > a:nth-child(n+1) {
  border-left: 1px solid #E4AF56;
}

nav > a:hover {
  background-color: #E4AF56;
}
</style>
