<template>
       <div class="show-attachments">
            <h3>Attachments</h3>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">N.o</th>
                        <th scope="col">File name</th>
                        <th scope="col">Size</th>
                        <th scope="col">Created By</th>
                        <th scope="col">Created At</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(attachment, index) in attachments" :key="attachment.id">
                        <td >{{ ++index }}</td>
                        <td><a :href="attachment.path" target="_blank">{{ getFileNameWithExtension(attachment) }}</a></td>
                        <td>{{ getFileSize(attachment.size) }}</td>
                        <td>{{ attachment.created_by }}</td>
                        <td>{{ attachment.created_at }}</td>
                        <td><button type="button" class="btn btn-danger button-item" @click="removeAttachment(attachment.id)"><i class="bi bi-trash"></i> Remove</button></td>
                    </tr>
                </tbody>     
            </table>
            <div class="mb-3 show_message_dialog">
                <ErrorDialog :errors= errors v-if="!isSuccess"></ErrorDialog>
                <SuccessDialog v-else>
                    Remove this attachment successfully!
                </SuccessDialog>
            </div>
        </div>  
</template>

<script>
    import SuccessDialog from './SuccessDialog.vue'
    import ErrorDialog from './ErrorDialog.vue'

    import axios from 'axios'
    const api_baseUrl= import.meta.env.VITE_BE_API;

    export default {
        components: {
            SuccessDialog,
            ErrorDialog
        },
        props: {
            project_id: Number
        },
        data() {
            return {
                token: this.$store.state.token,
                attachments: [],
                errors: [],
                isSuccess: false,
            }
        },
        methods: {
            getFileNameWithExtension: function(attachment) {
                return `${attachment.name}.${attachment.extension}`;
            },
            getFileSize: function(size) {
                const size_kb = `${(size/1000).toFixed(2)} KB`;
                return size_kb;
            },
            //Remove an attachment
            removeAttachment: function(attachment_id) {
                if(confirm('Do you want to remove this attachment?')) {
                    axios.delete(`${api_baseUrl}api/attachments/${attachment_id}`, {
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        }
                    }).then(response => {
                        const response_body = response.data;
                        this.isSuccess = true;
                        console.table(response_body);
                    }).catch(e => {
                        const error_response = e.response.data;
                        const error_message = `Error ${error_respone.status} - ${error_response.message}`;
                        this.errors.push(error_message);
                    })
                    
                } else {
                    alert('You canceled!')
                }
            }
        },
        created() {
            axios.get(`${api_baseUrl}api/projects/${this.project_id}/list-attachments`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-type': 'multipart/form-data'
                }
            }).then(response => {
                    const respone_body = response.data;
                    this.attachments = respone_body.data.attachments;
                    console.log(respone_body);
            })
        },
        watch: {
            project_id() {
                axios.get(`${api_baseUrl}api/projects/${this.project_id}/list-attachments`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-type': 'multipart/form-data'
                    }
                }).then(response => {
                    const respone_body = response.data;
                    this.attachments = respone_body.data.attachments;
                })
            }
        }
    }
</script>