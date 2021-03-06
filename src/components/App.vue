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
import * as config from '../config';

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
    if (window.location.href.includes('http://localhost')) document.title += ' (DEV)';
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
      return this.users.find(u => u.id === this.userID) || NOT_FOUND_USER;
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
          const points = this.users.find(u => u.id === userID).points + 0;
          this.refreshData().then(() => {
            this.reportSuccess = points !== this.users.find(u => u.id === userID).points
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
          'Accept': 'application/json',
          'Content-Type': 'application/json'
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
      route: config.route
    };
  }
}

</script>

<style>
nav {
  display: flex;
  justify-items: stretch;
}

nav > a {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1 1;
  text-align: center;
  font-size: 24px;
  padding: 8px;
  background-color: #ffce00;
  border-bottom: 3px solid #cca400;
}

nav > a:nth-child(n+1) {
  border-left: 1px solid #efc000;
}

nav > a:hover {
  background-color: #cca400;
}
</style>
