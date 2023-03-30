<template>
    <div class="container mt-5">
        <h2 class="mb-4">Forgot Password</h2>
        <form id="forgot_password_form">
            <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input type="email" class="form-control" id="email" aria-describedby="emailHelp">
            </div>
            <div class="mb-3 d-flex justify-content-between">
                <router-link to="/">Back to home page</router-link>
            </div>
            <div class="mb-3 mt-4">
                <button type="submit" class="btn btn-primary">Submit</button>
            </div>
        </form>
    </div>
    <router-view></router-view>
</template>

<script>
  export default {}
</script>