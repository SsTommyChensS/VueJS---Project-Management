<template>
    <!-- Header -->
    <div class="header">
      <nav class="navbar navbar-expand-sm" style="background-color: #e3f2fd;">
        <div class="container-fluid">
          <!-- Links -->
          <router-link class="navbar-brand" to="/dashboard">Shared Project</router-link>
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link" to="">Hello <span class="email-name">{{ getUserInfo }}</span></router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/" @click="clearUserInfo">Sign Out</router-link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
    <!-- Container -->
    <div class="container-fluid" style="margin-top: 20px">    
      <div class="row content text-left">
        <div class="col-sm-2 sidenav sidebar-menu" style="background-color: #b3b3cc;">
          <ul class="navbar-nav">
            <li class="nav-item vert-menu-item">
              <router-link class="nav-link" to="/dashboard/my-profile">My Profile</router-link>
            </li>
            <li class="nav-item vert-menu-item">
              <router-link class="nav-link" to="/dashboard/my-project">My Project</router-link>
            </li>
            <li class="nav-item vert-menu-item">
              <router-link class="nav-link" to="/dashboard/my-shared-project">My Shared project</router-link>
            </li>
            <li class="nav-item vert-menu-item">
              <router-link class="nav-link" to="/dashboard/all-projects">All Projects</router-link>
            </li>
          </ul>
        </div>
        <div class="col-sm-10 p-3">       
            <router-view></router-view> 
        </div>
      </div>
  </div>   
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    methods: {
      clearUserInfo: function() {
        //Remove user
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        this.$store.dispatch('logout');
      }
    },
    computed: {
      getUserInfo() {
        const user = JSON.parse(localStorage.getItem('user'));
        const username = user.name;
        return username;
      }
    }
  }
</script>

<style>
  .email-name {
    color: #cc4400;
    font-weight: bold;
    font-size: 15px;
    font-family: Verdana;
  }

  .sidebar-menu {
    max-height: 100%;
    padding: 10px 0;
  }

  .vert-menu-item {
    font-size: 20px;
    text-transform: capitalize;
    padding: 10px 0;
  }

  .vert-menu-item:hover {
    padding-left: 20px;
    background-color: #2d5986;
    color: #ffffff;
  }
</style>