<template>
    <h1>This is example Calling API using axios</h1>
    <div class="button_menu py-3">
      <button @click="getAllUsers" class="btn btn-success mx-3">Get all users</button>
      <button @click="getAllPosts" class="btn btn-primary mx-3">Get all posts</button>
      <button @click="this.$refs.userIdList.disabled = false" class="btn btn-danger mx-3">Get posts by an user name</button>
      <select class="form-select-sm" name="userIdList" id="userIdList" ref="userIdList" disabled @change="getPostsByUser($event)">
        <option selected disabled>Choose one</option>
        <option v-for="user in users" :value="user.id">{{ user.name }}</option>
      </select>
    </div>
  
    <div class="data_show">
      <ul v-if="options == 1" v-for="user in users">
        <li><strong>UserId: {{ user.id }}</strong></li>
        <ul>
          <li>Name: {{ user.name }}</li>
          <li>Email: {{ user.email }}</li>
          <li>Phone: {{ user.phone }}</li>
          <li>Company: {{ user.company.name }}</li>
        </ul>
      </ul>

      <ul v-if="options == 2" v-for="post in posts">
        <li><strong>UserId: {{ post.userId }}</strong></li>
        <ul>
          <li>Title: {{ post.title }}</li>
          <li>Content: {{ post.body }}</li>
        </ul>
      </ul>

      <ul v-if="options == 3" v-for="post in posts_belong_user">
        <li><strong>Post Id: {{ post.id }}</strong></li>
        <ul>
          <li>Title: {{ post.title }}</li>
          <li>Content: {{ post.body }}</li>
        </ul>      
      </ul>     
    </div>
    <div class="show_error_dialog" v-if="errors.length != 0" v-for="(error, index) in errors">
        <div class="alert alert-danger" :key="index">
            {{ error }}
        </div>
    </div>
    <div class="show_error_dialog" v-if="isSuccess">
        <div class="alert alert-success">
            Success
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import VueJwtDecode from 'vue-jwt-decode';

export default {
  data() {
    return {
      base_url: 'http://jsonplaceholder.typicode.com',
      options: 0, //1:all users, 2:all posts,3:posts by a user
      posts: [],
      users: [],
      posts_belong_user: [],
      errors: [],
      info: {
        hi: 'hello',
        name: 'a'
      },
      isSuccess: false,
    }
  }, 
  computed: {
    renderComponent() {
      switch (this.option) {
        case 1:
          return 'UserComponent';
        case 2:
          return 'TitleComponent';
        case 3:
          return 'TitleComponent2';
        default:
          return null;
      }
    }
  },
  methods: {
    //Get all posts
    async getAllPosts() {
        await axios.post('https://dummyjson.com/auth/login', {
          username: 'atuny0',
          password: '9uQFF1Lh'
        }).then(response => {
          const user = {
            id: response.data.id,
            username: response.data.username,
            email: response.data.email,
          };
          const token = response.data.token;
          //Update state by trigger mutations using dispatch action
          this.$store.dispatch('login', { token, user });
          const user_info = VueJwtDecode.decode(this.$store.state.token);
          console.table(user_info);
          console.log(this.$store.state.token);
        }).catch(e => {
          console.table({
            status: e.response.status,
            message: e.response.data.message
          });
        })
    },
    //Get all users
    getAllUsers() {
        localStorage.setItem('storedData', this.options);
        this.options = 1;
        axios.get(`${this.base_url}/users`)
            .then(response => {
                this.users = response.data;
                console.table(this.users);
        })
        .catch(e => {
            this.errors.push(e);
        });
    },
    //Get posts by user id
    getPostsByUser(event) {
      this.options = 3;
      const user_id = event.target.value;
      axios.get(`${this.base_url}/posts?userId=${user_id}`)
        .then(response => {
          this.posts_belong_user = response.data;
          console.table(this.posts_belong_user);
        })
        .catch(e => {
          this.errors.push(e);
        });
    },

  },
  created() {

  },
}
</script>