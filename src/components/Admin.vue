<template>
  <article>
    <h1>Admin</h1>
    <h2>Users</h2>
    <table>
      <tr>
        <th>Image</th>
        <th>Name</th>
        <th>Link</th>
        <th></th>
      </tr>
      <tr v-for="user in users" :key="user.id">
        <td>
          <img :src="user.imageURL" class="small-avatar" />
          <input type="text" v-model="user.imageURL">
        </td>
        <td><input type="text" v-model="user.name"></td>
        <td>
          <span>{{generateLink(user.key)}}</span>
          <button class="material-button" :data-clipboard-text="generateLink(user.key)" v-clipboard>
            <i class="material-icons">content_copy</i>
          </button>
        </td>
        <td>
         <button class="material-button" @click="() => { saveUser(user.id) }">
            <i class="material-icons">save</i>
          </button>
        </td>
      </tr>
      <tr>
        <td>
          <img :src="newUser.imageURL" class="small-avatar" />
          <input type="text" v-model="newUser.imageURL">
          <input type="file" @change="onFileChanged">
          <button @click="uploadImage">Upload</button>
        </td>
        <td><input type="text" v-model="newUser.name"></td>
        <td />
        <td>
         <button class="material-button" @click="addUser">
            <i class="material-icons">save</i>
          </button>
        </td>
      </tr>
    </table>

    <h2>Offences</h2>
    <table>
      <tr>
        <th>Description</th>
        <th>Points</th>
        <th></th>
      </tr>
      <tr v-for="offence in offences" :key="offence.id">
        <td><input type="text" v-model="offence.description"></td>
        <td><input type="text" v-model="offence.points"></td>
        <td>
         <button class="material-button" @click="() => { saveOffence(offence.id) }">
            <i class="material-icons">save</i>
          </button>
        </td>
      </tr>
      <tr>
        <td><input type="text" v-model="newOffence.description"></td>
        <td><input type="text" v-model="newOffence.points"></td>
        <td>
         <button class="material-button" @click="addOffence">
            <i class="material-icons">save</i>
          </button>
        </td>
      </tr>
    </table>
  </article>
</template>
new Clipboard('.btn');

<script>
export default {
  name: 'admin-page',
  props: ['users', 'offences'],
  data() {
    return {
    newUser: {
      imageURL: '/images/user.png',
      name: ''
    },
    newOffence: {
      description: '',
      points: ''
    }
  }},
  methods: {
    addUser() {
      this.$emit('add-user', this.newUser);
    },

    saveUser(userID) {
      this.$emit('modify-user', {userID, user: this.users.find(u => u.id == userID)});
    },

    addOffence() {
      this.$emit('add-offence', this.newOffence);
    },

    saveOffence(offenceID) {
      this.$emit('modify-offence', { offenceID, offence: this.offences.find(o => o.id == offenceID)});
    },

    generateLink(key) {
      return location.origin + '/welcome?key=' + key;
    }
  }
}
</script>
