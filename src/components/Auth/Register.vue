<template>
    <div class="container mt-5">
        <h2 class="mb-4">Register</h2>
        <form id="register_form" @submit.prevent ="checkFormRegister">
            <div class="mb-3">
                <label for="name" class="form-label label_title">Full name</label>
                <input type="text" class="form-control" id="name" placeholder="Your name here" maxlength="30" v-model="user.name">
            </div>
            <div class="mb-3">
                <label for="birthday" class="form-label label_title">Birthday</label>
                <input type="date" class="form-control" id="birthday" v-model="user.birthday" style="max-width: 35%">
            </div>
            <div class="mb-3">
                <label for="gender" class="form-label label_title gender-label">Gender</label>
                <div class="form-check-inline">
                    <input type="radio" class="form-check-input" id="gender_male" v-model="user.sex" value="1" checked>
                    <label class="form-check-label" for="gender_male">Male</label>
                </div>
                <div class="form-check-inline">
                    <input type="radio" class="form-check-input" id="gender_female" v-model="user.sex" value="2">
                    <label class="form-check-label" for="gender_female">Female</label>
                </div>
                <div class="form-check-inline">
                    <input type="radio" class="form-check-input" id="gender_other" v-model="user.sex" value="3">
                    <label class="form-check-label" for="gender_other">Other</label>
                </div>
            </div>
            <div class="mb-3">
                <label for="phone_number" class="form-label label_title">Phone number</label>
                <input type="text" class="form-control" id="phone_number" placeholder="Your phone number here" v-model="user.phone"/>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label label_title">Email address</label>
                <input type="text" class="form-control" id="email" placeholder="Your email here" maxlength="30" v-model="user.email"/>
            </div>
            <div class="mb-3">
                <label for="avatar" class="form-label label_title">Avatar</label>
                <input type="file" class="form-control" id="avatar" accept="image/png, image/jpeg"  @change="getAvatar"/>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label label_title">Password</label>
                <input type="password" class="form-control" id="paswword" placeholder="Your password here" v-model="user.password" >
            </div>
            <div class="mb-3">
                <label for="password_confirmed" class="form-label label_title">Comfirm your password</label>
                <input type="password" class="form-control" id="password_confirmed" placeholder="Your password confirmed here" v-model="user.password_confirm">
            </div>
            <div class="mb-3 d-flex justify-content-between">
                <router-link to="/login">Already have account? Log in here</router-link>
            </div>
            <div class="mb-3 show_message_dialog">
                <div class="show_error_dialog" v-if="!isSuccess" v-for="(error,index) in errors">
                    <div class="alert alert-danger" :id="index">
                        {{ error }}
                    </div>
                </div>
                <div class="show_success_dialog" v-else>
                    <div class="alert alert-success">
                        {{ success_message }}
                    </div>
                </div>
            </div>
            <div class="mb-3 mt-4">
                <button type="submit" class="btn btn-primary">Register</button>
                <button type="reset" class="btn btn-secondary ms-4">Reset</button>
            </div>
        </form>
    </div>
</template>

<script>
  import ValidationRule from '../../rules/index.js'
  import axios from 'axios'

  export default {
    data() {
        return {
            user: {
                name: '',
                birthday: '',
                sex: 1,
                phone: '',
                email: '',
                avatar: null,
                password: '',
                password_confirm: '',
            },
            success_message: '',
            errors: [],
            isSuccess: false,
        }
    },
    methods: {
        getAvatar: function(e) {
            const fileList = event.target.files;
            this.user.avatar = fileList[0];
            console.table(this.user.avatar);
        },
        checkFormRegister: function(e) {
            //Empty all errors
            this.errors = [];

            //Check name
            if(ValidationRule.isEmpty(this.user.name)) {
                this.errors.push('Fullname required!');
                return;
            }
            //Check birthday
            if(ValidationRule.isEmpty(this.user.birthday)) {
                this.errors.push('Valid birthday required!');
                return;
            } else if(!ValidationRule.isValidBirthday(this.user.birthday)) {
                this.errors.push('Invalid birthday');
                return;
            }
            //Check phone number
            if(ValidationRule.isEmpty(this.user.phone)) {
                this.errors.push('Phone number required!');
                return;
            } else if(!ValidationRule.isValidPhoneNumber(this.user.phone)) {
                this.errors.push('Invalid phone number');
                return;
            }
            //Check email
            if(ValidationRule.isEmpty(this.user.email)) {
                this.errors.push('Valid email required!');
                return;
            } else if (!ValidationRule.isValidEmail(this.user.email)) {
                this.errors.push('Invalid email!');
                return;
            }
            //Check avatar
            if(ValidationRule.isEmpty(this.user.avatar)) {
                this.error.push('Valid avatar required!');
                return;
            }
            //Check password
            if(ValidationRule.isEmpty(this.user.password)) {
                this.errors.push('Password required!');
                return;
            } else if(!ValidationRule.isValidPassword(this.user.password)) {
                this.errors.push('Invalid password! Password must be from 8 to 15 charaters. only characters, numeric digits, underscore and first character must be a letter!');
                return;
            }
            //Check password_confirm
            if(ValidationRule.isEmpty(this.user.password_confirm)) {
                this.errors.push('Pasword confirmed required!');
                return;
            } else if(!ValidationRule.isTheSameValue(this.user.password, this.user.password_confirm)) {
                this.errors.push('Password confirmed is not the same with password!');
                return;
            }
            //If there're no errors -> Success 
            if(!this.errors.length) {
                axios.post(`${import.meta.env.VITE_BE_API}api/auth/register`, this.user, {
                    headers: {
                        'Content-type': 'multipart/form-data'
                    }
                })
                    .then(response => {
                      if(response.data.status == 200) {
                            this.success_message = response.data.message;
                            this.isSuccess = true;
                            console.log(response.data);
                      }
                    }).catch(e => {
                        let message = '';
                        let error = e.response.data;
                        switch(e.response.status) {
                            //Email already existed
                            case 422:
                                message = `Error: ${error.http} - ${error.error.email}`;
                                break;
                            case 400:
                                message = `Error: ${error.http} - Bad request!`;
                        }
                        this.errors.push(message);         
                    })
            }              
        },
    }
  }
</script>

<style>
    .label_title {
        color:  #66a3ff;
        font-weight: bold;
        font-style: italic;
    }

    .gender-label {
        margin-right: 20px;
    }
</style>