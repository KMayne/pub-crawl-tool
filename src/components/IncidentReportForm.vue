<template>
  <article>
    <h1>Incident Reporting Tool</h1>
    <section v-if="!submitted">
      <section>
        <h2>Offender</h2>
        <div class="button-container">
          <a href="#offences" v-for="user in users" :key="user.id" :class="[{ 'toggle-button-selected': offender === user.id }, 'button', 'toggle-button', 'picture-button']" v-on:click="() => { toggleOffender(user.id) }">
            <img :src="user.imageURL" class="small-avatar" />
            <span>{{user.name}}</span>
          </a href="#offences">
        </div>
      </section>
      <section id="offences">
        <h2>Offence</h2>
        <div class="button-container">
          <a href="#submit-btn" v-for="offence in offences" :key="offence.id" :class="[{ 'toggle-button-selected': currentOffence === offence.id }, 'button', 'toggle-button', 'picture-button', 'split-button']" v-on:click="() => {  toggleOffence(offence.id) }">
            <div>
              <span>{{offence.description}}</span>
            </div>
            <div>{{offence.points}}</div>
          </a>
        </div>
      </section>
      <button id="submit-btn" @click="submitForm" class="submit-button">
        <i class="material-icons">done</i>
        <span>Submit Report</span>
      </button>
      <p v-if="error" class="error-message">{{error}}</p>
    </section>
    <section class="submitted-box" v-if="submitted">
      <p v-if="!reportSuccess" class="error-message">Failed to submit</p>
      <img v-if="reportSuccess" src="../assets/tick.svg" class="tick" />
      <span v-if="reportSuccess" class="submitted-message">Incident submitted</span>
      <div>
        <button @click="resetForm">Submit another report</button>
      </div>
    </section>
  </article>
</template>

<script>
export default {
  name: 'incident-report-form',
  props: ['users', 'offences', 'reportSuccess'],
  data() {
    return {
      offender: null,
      currentOffence: null,
      submitted: false,
      error: null
    };
  },
  methods: {
    submitForm: function () {
      if (!this.offender || !this.currentOffence) {
        this.error = 'Please select ' + (!this.offender ? 'an offender' : '')
        + (!this.offender && !this.currentOffence ? ' and ' : '')
        + (!this.currentOffence ? 'an offence' : '');
        return false;
      }
      this.error = null;
      this.submitted = true;
      this.$emit('addUserOffence', { userID: this.offender, offenceID: this.currentOffence });
    },

    resetForm: function () {
      this.offender = null;
      this.currentOffence = null;
      this.submitted = false;
      this.error = null;
    },

    toggleOffender: function (userID) {
      if (this.offender !== userID) {
        this.offender = userID;
      } else {
        this.offender = null;
      }
    },

    toggleOffence: function (offenceID) {
     if (this.currentOffence !== offenceID) {
       this.currentOffence = offenceID;
     } else {
       this.currentOffence = null;
     }
   }
 }
}
</script>
