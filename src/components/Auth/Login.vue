<template>
    <div class="container mt-5">
        <h2 class="mb-4">Log In</h2>
        <form id="login_form" @submit.prevent="checkFormLogin">
            <div class="mb-3">
                <label for="email" class="form-label label_title">Email address</label>
                <input type="text" class="form-control" id="email" placeholder="Your email here" aria-describedby="emailHelp" v-model="user.email">
            </div>
            <div class="mb-3">
                <label for="password" class="form-label label_title">Password</label>
                <input type="password" class="form-control" id="paswword" placeholder="Your password here" v-model="user.password">
            </div>
            <div class="mb-3 d-flex justify-content-between">
                <router-link to="/register">Don't have account? Register here</router-link>
                <router-link to="/forgot-password">Forgot password?</router-link>
            </div>
            <div class="mb-3 show_message_dialog">
                <div class="show_error_dialog" v-if="!isSuccess" v-for="(error,index) in errors">
                    <div class="alert alert-danger" :id="index">
                        {{ error }}
                    </div>
                </div>
                <div class="show_success_dialog" v-else>
                    <div class="alert alert-success">
                        Log In Successfully, Ready to redirect!
                    </div>
                </div>
            </div>
            <div class="mb-3 mt-4">
                <button type="submit" class="btn btn-primary" ref="login_submit">Log In</button>
                <button type="reset" class="btn btn-secondary ms-4" ref="login_reset">Reset</button>
            </div>
        </form>
    </div>
</template>

<script>
    const api_baseUrl= import.meta.env.VITE_BE_API;
    
    import ValidationRule from '../../rules/index.js'
    import axios from 'axios'

    export default {
        data() {
            return {
                user : {
                    email: '',
                    password: '',
                },
                errors: [],
                isSuccess: false,
            }
        },
        methods: {
            disabledButton: function() {
                this.$refs.login_submit.disabled = true;
                this.$refs.login_reset.disabled = true;
            },
            checkFormLogin: function(e) {
                //Empty errors
                this.errors = [];
                //Check email
                if(ValidationRule.isEmpty(this.user.email)) {
                    this.errors.push('Valid email requied!');
                    return;
                } else if (!ValidationRule.isValidEmail(this.user.email)) {
                    this.errors.push('Invalid email!');
                    return;
                }
                //Check password
                if(ValidationRule.isEmpty(this.user.password)) {
                    this.errors.push('Password required!');
                    return;
                } 
                //If no error -> Login
                if(!this.errors.length) {
                    this.login();
                }
                e.preventDefault();
            },
            //Login
            login: function() {
                const body = {
                        email: this.user.email,
                        password: this.user.password   
                };
                axios.post(api_baseUrl+'api/auth/login', body)
                    .then(response => {
                        const response_body = response.data;

                        const user = response_body.data.user;
                        const token = response_body.data.authorization.token;

                        localStorage.setItem('user', JSON.stringify(user));
                        localStorage.setItem('token', token);
                        //Set user and token to vuex state
                        this.$store.dispatch('login', { token, user });

                        this.isSuccess = true;
                        this.disabledButton();

                        setTimeout(() => this.$router.push({ path: '/dashboard' }), 3000);
                    })
                    .catch(e =>{
                        const error_body = e.response.data;
                        const error_message = `Error ${error_body.status} - ${error_body.message}`;
                        this.errors.push(error_message);
                    })
            }
        }
    }
</script>

<style>
    .label_title {
        color:  #66a3ff;
        font-weight: bold;
        font-style: italic;
    }
</style>