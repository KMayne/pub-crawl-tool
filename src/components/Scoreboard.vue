<template>
  <article>
    <h1>Scoreboard</h1>
    <table>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Points</th>
      </tr>
      <tr v-for="user in processedUsers" :key="user.id" :class="user.id == currentUser ? 'current-user-row' : ''">
        <td>{{user.pos}}</td>
        <td><img :src="user.imageURL" class="small-avatar" /><a :href="'/users/' + user.id">{{user.name}}</a></td>
        <td>{{user.points}}</td>
      </tr>
    </table>
  </article>
</template>

<script>
export default {
  name: 'scoreboard-page',
  props: ['users', 'currentUser'],
  computed: {
    processedUsers() {
      if (!this.users || !this.users.map) return [];
      return this.users.map(obj => ({
        id: obj.id,
        name: obj.name,
        imageURL: obj.imageURL,
        points: obj.points
      }))
      .sort((a, b) => b.points - a.points)
      .map((user, index) => {
        user.pos = index + 1;
        return user;
      });
    }
  }
}
</script>

<style>
  .small-avatar {
    margin-right: 5px;
  }
</style>
