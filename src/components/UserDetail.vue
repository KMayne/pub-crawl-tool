<template>
  <article>
    <img :src="user.imageURL" class="avatar-big" />
    <h1>{{user.name}}</h1>
    <h2>Points: {{user.points}}</h2>
    <br>
    <table>
      <tr>
        <th>Offence</th>
        <th>Time</th>
        <th>Submitter</th>
        <th>Points</th>
        <th v-if="!isCurrentUser"></th>
      </tr>
      <tr v-for="offence in user.offences" :key="offence.id">
        <td>{{offence.description}}</td>
        <td>{{formatTime(offence.timestamp)}}</td>
        <td>{{offence.submitter}}</td>
        <td>{{offence.points}}</td>
        <td v-if="!isCurrentUser">
          <button class="material-button" @click="() => { deleteOffence(offence.id) }">
            <i class="material-icons">delete</i>
          </button>
        </td>
      </tr>
    </table>
  </article>
</template>

<script>
export default {
  name: 'user-detail',
  props: ['user', 'isCurrentUser'],
  methods: {
    deleteOffence(userOffenceID) {
      this.$emit('deleteOffence', { userID: this.user.id, userOffenceID });
    },

    formatTime(timestamp) {
      timestamp = new Date(timestamp);
      let hours = timestamp.getHours();
      const period = hours < 12 ? 'am' : 'pm';
      hours = hours % 12;
      if (hours === 0) hours = 12;
      const minutes = this.pad(timestamp.getMinutes());
      const date = timestamp.getDate();
      const month = timestamp.getMonth() + 1;
      return `${hours}:${minutes}${period} ${date}/${month}`;
    },

    pad(num) {
      const numStr = '' + num;
      return num < 10 ? '0' + numStr : numStr;
    }
  }
}
</script>

<style>
article {
  display: flex;
  flex-direction: column;
  justify-items: center;
}

h1 {
  margin-bottom: 0;
}

h2 {
  text-align: center;
}

.avatar-big {
  width: 128px;
  height: 128px;
  border-radius: 50%;
  margin: auto;
}
</style>
