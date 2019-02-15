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
  <GmapMap
    :center="{lat: 51.5109007, lng: -0.1374553}"
    :zoom="12"
    map-type-id="roadmap"
    style="width: 100%; height: 300px"
    :options="{
      zoomControl: false,
      clickableIcons: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: true,
      disableDefaultUi: false,
      styles: [{
        featureType: 'poi',
        stylers: [{visibility: 'off'}]
      }]
    }">
    <gmap-info-window :options="mapInfo.options"
                      :position="mapInfo.currPub.geolocation"
                      :opened="mapInfo.isOpen"
                      @closeclick="mapInfo.isOpen=false">
      <h3>{{mapInfo.currPub.name}} ({{mapInfo.currPub.stationName}})</h3>
      <h4>{{mapInfo.currPub.time && mapInfo.currPub.time.format()}}</h4>
    </gmap-info-window>
    <GmapMarker
      v-for="pub in route"
      :key="pub.name"
      :position="pub.geolocation"
      :clickable="true"
      @click="toggleInfoWindow(pub)">
    </GmapMarker>
    <GmapMarker
      v-for="ci in currentCheckIns"
      :key="ci.userId"
      :position="ci.position"
      :clickable="false"
      :icon="ci.icon">
    </GmapMarker>
  </GmapMap>
  <h2>Schedule</h2>
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
      <td>{{pub.notes}}{{pub.walking ? (pub.notes ? ', w' : 'W') + 'alking to next pub' : ''}}</td>
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
  data: () => ({
    mapInfo: {
      isOpen: false,
      options: {
        pixelOffset: {
          width: 0,
          height: -35
        }
      },
      currPub: {}
    }
  }),
  computed: {
    checkIns: function () {
      return this.currentUser ? this.currentUser.checkIns : [];
    },
    nextPub: function () {
      // Find start pub
      const startPub = this.route.findIndex(pub =>
        this.checkIns.some(ci => ci.pubName === pub.name));
      // Pick first pub not checked into after
      return this.route.slice(Math.max(0, startPub))
        .find(pub => !this.checkIns.some(ci => ci.pubName === pub.name));
    },
    pubVisitors: function () {
      if (!this.route || !this.users) return {};
      return this.users.reduce((pubs, user) => {
        user.checkIns.forEach(ci => {
          if (!pubs[ci.pubName]) pubs[ci.pubName] = [];
          pubs[ci.pubName].push(user);
        });
        return pubs;
      }, {});
    },
    currentCheckIns: function () {
      if (!this.route || !this.users) return {};
      return this.users.filter(u => u.checkIns.length !== 0).map(user => {
        const mostRecentPub = this.route.find(pub => pub.name === user.checkIns[user.checkIns.length - 1].pubName);
        return ({
          userId: user.id,
          position: mostRecentPub.geolocation.perturb(),
          icon: {
            scaledSize: { width: 20, height: 20 },
            url: user.imageURL
          }
        });
      });
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
    },
    toggleInfoWindow: function(pub) {
      this.mapInfo.isOpen = this.mapInfo.currPub !== pub || !this.mapInfo.isOpen;
      this.mapInfo.currPub = pub;
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

