<template>
<article>
  <!-- Next pub -->
  <section v-if="nextPub" class="next-pub">
    <h1>Next pub: {{nextPub.name}} ({{nextPub.stationName}})</h1>
    <h2>Scheduled Arrival: <span :class="{ 'behind-schedule': nextPub.time.passed() }">{{nextPub.time.format()}}</span></h2>
    <h3>Mode of transport: {{nextPub.walking ? 'Walking' : 'Tube'}}</h3>
    <button id="#checkin-btn" @click="checkIn(nextPub.name)" class="submit-button">
      <span>Check In</span>
      <i class="material-icons">done</i>
    </button>
  </section>
  <section v-else>
    <h1>Congratulations - you have completed the pub crawl! 🍻</h1>
  </section>
  <hr>
  <div class="scroll-container">
  <table>
    <tr>
      <th>Station</th>
      <th>Pub</th>
      <th>Scheduled Time</th>
      <th>Notes</th>
      <th>Check-in Time</th>
      <th>Checked In</th>
    </tr>
    <tr v-for="pub in route" :key="pub.name">
      <td>{{pub.stationName}}</td>
      <td>{{pub.name}}</td>
      <td>{{pub.time.format()}}</td>
      <td>{{pub.notes}}{{pub.walking ? (pub.notes ? ' ' : '') + 'Walking' : ''}}</td>
      <td><a @click="removeCheckIn(pub.name)">{{formatTime((checkIns.find(ci => ci.pubName === pub.name)||{}).timestamp)}}</a></td>
      <td><a v-for="user in pubVisitors[pub.name]" :href="'/users/' + user.id"><img :src="user.imageURL" class="small-avatar" /></a></td>
    </tr>
  </table>
  </div>
</article>
</template>

<script>
export default {
  name: 'route-page',
  props: ['route', 'users', 'currentUser'],
  computed: {
    checkIns: function () {
      return this.currentUser ? this.currentUser.checkIns : [];
    },
    nextPub: function () {
      return this.route.find(pub => !this.checkIns.some(ci => ci.pubName === pub.name));
    },
    pubVisitors: function () {
      if (!this.route || !this.users) return {};
      return this.users.reduce((pubs, user) => {
        user.checkIns.forEach(ci => {
          if (!pubs[ci.pubName]) pubs[ci.pubName] = [];
          pubs[ci.pubName].push(user);
        })
        return pubs;
      }, {});
    }
  },
  methods: {
    checkIn(pubName) {
      this.$emit('checkIn', { pubName });
    },
    removeCheckIn(pubName) {
      if (window.confirm('Are you sure you want to remove this check in?')) {
        this.$emit('removeCheckIn', { pubName });
      }
    },
    formatTime(dateStr) {
      return dateStr ? new Date(dateStr).toTimeString().substring(0, 5) : '';
    }
  }
};
</script>

<style>
.next-pub {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.next-pub > h1 {
  margin: 0;
}

.next-pub > h3 {
  margin: 0.5em;
}

.behind-schedule {
  color: red;
}
</style>
