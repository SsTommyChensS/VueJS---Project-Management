<template>
    <div class="header">
      <nav class="navbar navbar-expand-sm" style="background-color: #e3f2fd;">
        <div class="container-fluid">
          <!-- Links -->
          <router-link class="navbar-brand" to="/">My Project Demo</router-link>
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link" to="/register">Register</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/login">Log In</router-link>
            </li>
          </ul>
        </div>
      </nav>
    </div> 
    <router-view></router-view>
</template>
