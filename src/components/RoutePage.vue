<template>
<article>
  <!-- Next pub -->
  <section v-if="nextPub" class="next-pub">
    <h1>Next: {{nextPub.name}}</h1>
    <h2 class="station-name"><img src="images/roundel.svg" />{{nextPub.stationName}}</h2>
    <h2>Scheduled Arrival: <span :class="{ 'behind-schedule': nextPub.time.passed() }">{{nextPub.time.format()}}</span></h2>
    <h3 v-if="nextPub.walking">Walking</h3>
    <button id="#checkin-btn" @click="checkIn(nextPub.name)" class="submit-button">
      <span>Check In</span>
      <i class="material-icons">done</i>
    </button>
  </section>
  <section v-else class="next-pub">
    <h1>Congratulations - you have completed the pub crawl! 🍻</h1>
  </section>
  <GmapMap
    :center="{lat: 51.5109007, lng: -0.1374553}"
    :zoom="12"
    map-type-id="roadmap"
    style="width: 100%; height: 300px; margin: 8px 0;"
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
  </GmapMap>
  <div class="scroll-container">
  <table>
    <thead>
      <tr>
        <th>Pub</th>
        <th>Time</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="pub in route">
        <tr>
          <td>{{pub.name}}<br />
          <span class="station-name"><img src="images/roundel.svg" />{{pub.stationName}}</span><br />
          <span class="info">{{pub.notes}}{{pub.walking ? (pub.notes ? ' &bull; ' : '') + 'Walking' : ''}}</span></td>
          <td><span :class="{'strike': checkIns.find(ci => ci.pubName === pub.name)}">{{pub.time.format()}}</span><br />
          <a @click="removeCheckIn(pub.name)">{{formatTime((checkIns.find(ci => ci.pubName === pub.name)||{}).timestamp)}}</a></td>
        </tr>
        <tr :class="{'hidden': !pubVisitors[pub.name]}">
          <td colspan="2"><a v-for="user in pubVisitors[pub.name]" :href="'/users/' + user.id"><img :src="user.imageURL" class="small-avatar" /></a></td>
        </tr>
      </template>
    </tbody>
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
  padding: 20px;
  background-color: #eee;
  border-bottom: 3px solid #ccc;
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
  color: #cc3706;
}

.station-name img {
  margin-right: 5px;
  height: 16px;
}

.strike {
  text-decoration: line-through;
}

.strike, .info {
  color: #8d8f93;
}

.info {
  font-size: 12px;
}

.hidden {
  display: none;
}

tr > * {
  line-height: normal;
}
</style>

