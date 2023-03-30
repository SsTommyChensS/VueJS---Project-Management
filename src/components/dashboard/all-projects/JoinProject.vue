<template>
    <div class="col-sm-7">
        <div class="show-join">
            <h3>Join project {{ project.title }}</h3>
            <form id="invite-user" @submit.prevent="joinProject">
                <div class="mb-3">
                    <label for="project-code" class="form-label label_title">Project's code:</label>
                    <input type="text" class="form-control" id="project-code" placeholder="Input project's code here" aria-describedby="emailHelp" v-model="project_code">
                </div>
                <div class="mb-3 show_message_dialog">
                    <ErrorDialog :errors="errors" v-if="!isSuccess"></ErrorDialog>
                    <SuccessDialog v-else>
                        Join project {{ project.title }} successfully!
                    </SuccessDialog>
                </div>
                <div class="mb-3 mt-4">
                    <button type="submit" class="btn btn-primary"><i class="bi bi-chevron-right"></i> Join</button>
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

    import axios from 'axios'
    const api_baseUrl= import.meta.env.VITE_BE_API;

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
                token: this.$store.state.token,
                project: {},
                project_code: '',
                permission_type: '',
                isDisabled: true,
                isSuccess: false,
                errors: [],      
            }
        },
        created() {
            this.project = {...this.project_item};
        },
        watch: {
            project_item() {
                this.project = {...this.project_item};
            }
        },
        methods: {
            //Join Project by project's code (Done)
            joinProject: function() {
                //Empty error
                this.errors = [];

                if(ValidationRule.isEmpty(this.project_code)) {
                    this.errors.push('Project code required!');
                    return;
                }

                //If no error -> Success
                if(!this.errors.length) {
                    const body = {
                        code: this.project_code
                    };
                    axios.post(`${api_baseUrl}api/user/join-project`, body, {
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        }
                    }).then(response => {
                        this.isSuccess = true;
                    }).catch(e => {
                        const error_body = e.response.data;
                        const error_message = `Error ${error_body.status}: ${error_body.message}`;
                        this.errors.push(error_message);
                    })
                }  
            }
        }
    }
</script>

