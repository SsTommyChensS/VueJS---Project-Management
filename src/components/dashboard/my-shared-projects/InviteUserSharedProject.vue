<template>
    <div class="col-sm-7">
        <div class="show-invite">
            <h3>Invite user for {{ project_item.title }}</h3>
            <form id="invite-user" @submit.prevent="inviteUser">
                <div class="mb-3">
                    <label for="user-code" class="form-label label_title">User's code:</label>
                    <input type="text" class="form-control" id="user-code" placeholder="Input user's code here" aria-describedby="emailHelp" v-model="user_code">
                </div>
                <div class="mb-3">
                    <label class="form-label label_title">Set permission:</label>
                    <select class="form-select" aria-label="Default select example" v-model="permission_type">
                        <option selected disabled>Set permission type</option>
                        <option value="1">View</option>
                        <option value="2">Edit</option>
                        <option value="3">Full</option>
                    </select>
                </div>
                <div class="mb-3 show_message_dialog">
                    <ErrorDialog :errors="errors" v-if="!isSuccess"></ErrorDialog>
                    <SuccessDialog v-else>
                        Invite user successfully!
                    </SuccessDialog>
                </div>
                <div class="mb-3 mt-4">
                    <button type="submit" class="btn btn-primary"><i class="bi bi-person-add"></i> Invite</button>
                </div>
            </form>
        </div>
    </div>
    
</template>

<script>
    import ValidationRule from '../../../rules/index.js'
    //Success Dialog
    import SuccessDialog from '../items/SuccessDialog.vue'
    import ErrorDialog from '../items/ErrorDialog.vue'

    export default {
        components: {
            SuccessDialog,
            ErrorDialog
        },
        props: {
            project_item: Object
        },
        data() {
            return {
                project: this.project_item,
                user_code: '',
                permission_type: '',
                isDisabled: true,
                isSuccess: false,
                errors: [],      
            }
        },
        methods: {
            inviteUser: function() {
                //Empty error
                this.errors = [];

                if(ValidationRule.isEmpty(this.user_code)) {
                    this.errors.push('User code required!');
                    return;
                }

                if(ValidationRule.isEmpty(this.permission_type)) {
                    this.errors.push('Permission type required!');
                }
                 //If no error -> Success
                if(!this.errors.length) {
                    this.isSuccess = true;
                    console.table({
                        project_id: this.project.id,
                        user_code: this.user_code,
                        permission_type: this.permission_type
                    });
                }  
            }
        }
    }
</script>

