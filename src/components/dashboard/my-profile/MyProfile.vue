<template>
    <h1 class="mb-4">My Profile</h1>
    <form id="login_form" @submit.prevent="saveMyProfile">
            <div class="mb-3">
                <label class="form-label label_title" style="display:block">Avatar</label>
                <img :src=user_info.avatar class="img-fluid image_avatar" alt="Responsive image">
            </div>
            <div class="mb-3">
                <label for="fullname" class="form-label label_title">Fullname</label>
                <input type="text" class="form-control" id="fullname" placeholder="Your fullname here" v-model="user_info.name" :disabled="isDisabled">
            </div>
            <div class="mb-3">
                <label for="email" class="form-label label_title">Email</label>
                <input type="email" class="form-control" id="email" placeholder="Your email here" maxlength="30" v-model="user_info.email" disabled readonly>
            </div>
            <div class="mb-3">
                <label for="user_code" class="form-label label_title">User Code</label>
                <input type="text" class="form-control" id="user_code" placeholder="Your user code here" maxlength="30" v-model="user_info.user_code" disabled readonly>
            </div>
            <div class="mb-3">
                <label for="gender" class="form-label label_title gender-label">Gender</label>
                <div class="form-check-inline">
                    <input type="radio" class="form-check-input" id="gender_male" value="1" v-model="user_info.sex" :disabled="isDisabled">
                    <label class="form-check-label" for="gender_male">Male</label>
                </div>
                <div class="form-check-inline">
                    <input type="radio" class="form-check-input" id="gender_female" value="2" v-model="user_info.sex" :disabled="isDisabled">
                    <label class="form-check-label" for="gender_female">Female</label>
                </div>
                <div class="form-check-inline">
                    <input type="radio" class="form-check-input" id="gender_other" value="3" v-model="user_info.sex" :disabled="isDisabled">
                    <label class="form-check-label" for="gender_other">Other</label>
                </div>
            </div>
            <div class="mb-3">
                <label for="phone_number" class="form-label label_title">Phone number</label>
                <input type="text" class="form-control" id="phone_number" placeholder="Your phone number here" v-model="user_info.phone" :disabled="isDisabled"/>        
            </div>
            <div class="mb-3">
                <label for="birthday" class="form-label label_title">Birthday</label>
                <input type="date" class="form-control" id="birthday" style="max-width: 35%" v-model="user_info.birthday" :disabled="isDisabled"/>
            </div>
            <div class="mb-3 show_message_dialog">
                <ErrorDialog :errors="errors" v-if="!isSuccess"></ErrorDialog>
                <SuccessDialog v-else>
                    {{ message }}
                </SuccessDialog>
            </div>
            <div class="mb-3 mt-4">
                <button type="button" class="btn btn-lg btn-info" ref="profile_edit" @click="toggleDisabledInput">Edit</button>
                <button type="submit" class="btn btn-lg btn-primary ms-4" ref="profile_save" :disabled="isDisabled">Save</button>
            </div>
    </form>
</template>

<script>
    import ValidationRule from '../../../rules/index.js'
    //Success dialog
    import SuccessDialog from '../items/SuccessDialog.vue'
    import ErrorDialog from '../items/ErrorDialog.vue'

    import axios from 'axios'

    const api_baseUrl= import.meta.env.VITE_BE_API;

    export default {
        components: {
            SuccessDialog,
            ErrorDialog
        },
        data() {
            return {
                token: this.$store.state.token,
                user_info: this.$store.state.user,
                user_update: {},
                isDisabled: true,
                isSuccess: false,
                errors: [],
                message: '',      
            }
        },
        methods: {
            toggleDisabledInput: function() {
                this.isDisabled = !this.isDisabled;
            },
            getAvatar: function(e) {
                const fileList = event.target.files;
                this.user_info.avatar = fileList[0];
            },
            saveMyProfile: function() {
                //Empty errors
                this.errors = [];
                //Check fullname
                if(ValidationRule.isEmpty(this.user_info.name)) {
                    this.errors.push('Fullname requied!');
                    return;
                }
                //Check phone number
                if(ValidationRule.isEmpty(this.user_info.phone)) {
                    this.errors.push('Phone number required!');
                    return;
                } else if(!ValidationRule.isValidPhoneNumber(this.user_info.phone)) {
                    this.errors.push('Invalid phone number');
                    return;
                }
                //Check birthday
                if(ValidationRule.isEmpty(this.user_info.birthday)) {
                    this.errors.push('Valid birthday required!');
                    return;
                } else if(!ValidationRule.isValidBirthday(this.user_info.birthday)) {
                    this.errors.push('Invalid birthday');
                    return;
                } 
                
                if(!this.errors.length) {
                    //Skip avatar
                    const body = (({ avatar, ...o}) => o)(this.user_info);
                    axios.post(api_baseUrl+'api/user/update-info', body, {
                        headers: { 
                            'Authorization': `Bearer ${this.token}`,
                            'Content-type': 'multipart/form-data'
                        }
                    })
                        .then(response => {
                            const result = response.data;
                            this.message = result.message;
                            this.isSuccess = true;
                            this.isDisabled = true;
                        })
                        .catch(e => {
                            const error = e.response.data;
                            const error_message = `Error: ${error.status} - ${error.message}`;
                            this.errors.push(error_message);
                        })
                }
            }
        }
    }
</script>

<style>
    .image_avatar {
        width: 10%;
    }
</style>