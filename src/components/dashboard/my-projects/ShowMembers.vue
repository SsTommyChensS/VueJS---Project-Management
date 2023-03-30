<template>
    <div class="col-sm-7">
        <div class="show-invite">
            <h3>Members at {{ project_item.title }}</h3>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">N.o</th>
                        <th scope="col">Fullname</th>
                        <th scope="col">Email</th>
                        <th scope="col">Permission</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(user, index) in members" :key="index">
                        <td>{{ ++index }}</td>
                        <td>{{ user.name }}</td>
                        <td>{{ user.email }}</td>
                        <td>
                            <select class="form-select" aria-label="Default select example" v-model="user.permission_type" style="min-width:50%">
                                <option selected disabled>Set permission</option>
                                <option value="1">View</option>
                                <option value="2">Edit</option>
                                <option value="3">Full</option>
                            </select>
                        </td>
                        <td>
                            <button type="button" class="btn btn-outline-dark button-item" @click="changePermission(user)" v-if="user.id != owner.id"><i class="bi bi-person-fill-gear"></i> Change Permission</button>
                            <button type="button" class="btn btn-danger button-item" @click="removeMember(user)" v-if="user.id != owner.id"><i class="bi bi-trash"></i> Remove</button>
                        </td>
                </tr>
                </tbody>             
            </table>
            <div class="mb-3 show_message_dialog">
                <ErrorDialog v-if="!isSuccess" :errors= errors></ErrorDialog>
                <SuccessDialog v-else>
                    {{ success_message }}
                </SuccessDialog>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    
    import SuccessDialog from '../items/SuccessDialog.vue'
    import ErrorDialog from '../items/ErrorDialog.vue'
    
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
                owner: this.$store.state.user,
                project: {},
                members: [],
                errors: [],
                isSuccess: false,
                isDisabled: true,
                success_message: ''
            }
        }, 
        methods: {
            //Change permission
            changePermission: function(user) {
                this.error = [];

                const body = {
                    permission_type: parseInt(user.permission_type)
                };
                axios.put(`${api_baseUrl}api/projects/${this.project.id}/update-permission/${user.id}`, body)
                .then(response => {
                    console.log(response.data);
                    this.success_message = "Change user permission successfully!";
                    this.isSuccess = true;
                    setTimeout(() => {
                        this.isSuccess = false
                    }, 3000);
                })
            },
            removeMember: function(user) {
                this.error = [];

                axios.delete(`${api_baseUrl}api/projects/${this.project_item.id}/delete-user/${user.id}`)
                .then(response => {
                    const response_body = response.data;
                    
                    this.success_message = `Remove user ${user.name} successfully!`;
                    this.isSuccess = true;

                    setTimeout(() => {
                        this.isSuccess = false;
                    }, 5000);

                    console.table(response_body);
                }).catch(e => {
                    const error_respone = e.response.data;
                    const error_message = `Error ${error_respone.status} - ${error_respone.message}`;
                    this.errors.push(error_message);
                })
            }
        },
        created() {
            this.project = {...this.project_item};
            //
            axios.get(`${api_baseUrl}api/projects/${this.project.id}/list-user`, )
            .then(response => {
                this.members = response.data.data.users;
                console.log(this.members);
            }).catch(error => {
                const error_body = error.response.data;
                const error_message = `Error ${error_body.status} - ${error_body.message}`;
                this.errors.push(error_message);
            })
        },
        watch: {
            project_item() {
                this.project = {...this.project_item};
                axios.get(`${api_baseUrl}api/projects/${this.project.id}/list-user`)
                .then(response => {
                    this.members = response.data.data.users;
                }).catch(error => {
                    console.log(error);
                });
            }
        }
    }
</script>