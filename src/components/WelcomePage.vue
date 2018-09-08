<template>
  <article>
  	<h1>Welcome</h1>
      <p>Welcome to the official Circle Line Pub Crawl app. This app will serve as your guide for the crawl and is where you'll be recording penalty points.</p>
      <form v-if="currentUser.checkIns.length === 0" >
        <label>Please select the pub you're starting from: 
          <select v-model="selectedPub">
            <option v-for="pub in route" :value="pub.name">{{pub.name}}</option>
          </select>
        </label>
        <button id="#checkin-button" @click.prevent="checkIn(selectedPub)" class="submit-button">
          <span>Lets go!</span>
        </button>
      </form>
  </article>
</template>

<script>
export default {
  name: 'welcome-page',
  props: ['route', 'currentUser'],
  data() { return { selectedPub: this.route[0].name }; },
  methods: {
    checkIn: function (pubName) {
      this.$emit('checkIn', { pubName, redirect: true });
    }
  }
}
</script>

<style>
article, p {
  text-align: center;
}

.submit-button {
  margin-top: 0;
}
</style>
