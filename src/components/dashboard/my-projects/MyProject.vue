<template>
    <h1 class="mb-4">My Projects</h1>
    <div class="my_project_list">
        <div class="search-bar mb-3">
            <div class="search-bar__item m-2">
                <label>Title:</label>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <button class="btn btn-info" type="button" @click="showProjectsByTitle">Search <i class="bi bi-search-heart-fill"></i></button>
                    </div>
                    <input type="text" class="form-control" placeholder="Search Title" aria-label="" aria-describedby="basic-addon1" v-model="search_title">
                </div>
            </div>
            <div class="search-bar__item m-2">
                <label>Status:</label>
                <select class="form-select" aria-label="Default select example" @change="showProjectsByStatus">
                    <option selected disabled>Select project's status</option>
                    <option value="1">New</option>
                    <option value="2">In Process</option>
                    <option value="3">Done</option>
                    <option value="4">Out of date</option>
                    <option value="5">All</option>
                </select>
            </div>
        </div>
        <table class="table table-hover">
            <thead>
                <tr>
                    <th scope="col">N.o</th>
                    <th scope="col">Project Title</th>
                    <th scope="col">Description</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(project, index) in projects_filter">
                    <td>{{ ++index }}</td>
                    <td>{{ project.title }}</td>
                    <td>{{ project.description }}</td>
                    <td v-html="displayProjectStatus(project.status)"></td>
                    <td>
                        <button type="button" class="btn btn-secondary button-item" @click="showDetailsByProject(project)"><i class="bi bi-activity"></i> Detail</button>
                        <button type="button" class="btn btn-outline-danger button-item" @click="showMembers(project)"><i class="bi bi-person-lines-fill"></i> Members</button>
                        <button type="button" class="btn btn-warning button-item" @click="addAttachment(project)"><i class="bi bi-file-earmark-arrow-up-fill"></i> Add attachments</button>                                                                                                                                            
                        <button type="button" class="btn btn-info button-item" @click="showCommentsByProject(project.id)"><i class="bi bi-bar-chart-steps"></i> See comments</button>
                        <button type="button" class="btn btn-dark button-item" @click="inviteUserByUserCode(project)"><i class="bi bi-arrow-return-right"></i> Invite</button>
                        <button type="button" class="btn btn-danger button-item" @click="removeProject(project.id)"><i class="bi bi-trash"></i> Remove</button>
                    </td>
                </tr>
            </tbody>     
        </table>
        <LoadingSpinner v-if="isLoading"/>
        <ShowComments :comments="comments_filter" v-if="option == 1"/>
        <ShowMembers :project_item="project" v-if="option == 2"/>
        <InviteUser :project_item="project" v-if="option == 3"/>
        <MyDetailProject :project_item="project" v-if="option == 4"/>
        <AddAttachments :project_item="project" v-if="option == 5"/>
    </div>
    <button class="btn btn-lg btn-success mt-5" @click="this.$router.push({ path: '/dashboard/add-project' })"><i class="bi bi-plus"></i>Add Project</button>
</template>

<script>
    import LoadingSpinner from '../items/LoadingSpinner.vue'
    import InviteUser from '../items/InviteUser.vue'
    import MyDetailProject from './MyDetailProject.vue'
    import AddAttachments from '../items/AddAttachments.vue'
    import ShowComments from '../items/ShowComments.vue'
    import ShowMembers from './ShowMembers.vue'

    import axios from 'axios'

    const api_baseUrl= import.meta.env.VITE_BE_API;

    export default {
        components: {
            LoadingSpinner,
            InviteUser,
            MyDetailProject,
            AddAttachments,
            ShowComments,
            ShowMembers
        },
        data() {
            return {
                token: this.$store.state.token,
                projects: [],
                projects_filter: [],
                comments_filter: [],
                search_title: '',
                project: {},
                // Option value: 1: ShowComments, 3: InviteUser, 4: MyDetailProject, 5: AddAttachment 
                option: 0,
                isLoading: true,
            }
        },
        methods: {
            //Get all projects
            getMyProjects: function() {
                axios.get(`${api_baseUrl}api/projects/my-project`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                }).then(response => {
                    this.isLoading = false;
                    this.projects = response.data.data.projects;
                    this.projects_filter = this.projects;
                    console.log(this.projects);
                }).catch(error => {
                    console.log(error);
                })
            },
            
            //Show project detail (Done)
            showDetailsByProject: function(project) {
                this.option = 4;
                this.project = project;
            },
            //Display project status
            displayProjectStatus: function(status) {
                switch (status) {
                    case 1: return '<span class="project__status project__status--new">'+ 'New' +'</span>';
                    case 2: return '<span class="project__status project__status--inprocess">In Process</span>';
                    case 3: return '<span class="project__status project__status--done">Done</span>';
                    case 4: return '<span class="project__status project__status--outofdate">Out of date</span>';
                }
            },
            //Show projects by status (Done)
            showProjectsByStatus: function(e) {
                const status = e.target.value;
                if(status == 5) {
                    this.getMyProjects();
                } else {
                    axios.get(`${api_baseUrl}api/projects/my-project`, {
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        },
                        params: {
                            status: status
                        }
                    }).then(response => {
                        this.projects = response.data.data.projects;
                        this.projects_filter = this.projects;
                    }).catch(e => {
                        console.log(e);
                    })
                }                   
            },
            //Show projects by title (Done)
            showProjectsByTitle: function() {
                const search_title = this.search_title.toLowerCase();
                if(search_title  == '') {
                    this.getMyProjects();
                } else {
                    axios.get(`${api_baseUrl}api/projects/my-project`, {
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        },
                        params: {
                            title: search_title
                        }
                    }).then(response => {
                        this.projects = response.data.data.projects;
                        this.projects_filter = this.projects;
                    }).catch(e => {
                        console.log(e);
                    })
                }
            },
            //Show comments by project (Done)
            showCommentsByProject: function(projectId) {
                axios.get(`${api_baseUrl}api/projects/${projectId}/list-comments`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                }).then(response => {
                        this.comments_filter = response.data.data.comments.data;
                        this.option = 1;
                }).catch(e => {
                    console.log(e.response);
                })
            },
            //Join project by project's code (Done)
            inviteUserByUserCode: function(project) {
                this.option = 3;
                this.project = project;
            },
            //Show members each project (Done)
            showMembers: function(project) {
                this.option = 2;
                this.project = project;
            },
            //Add project's attachment (Done)
            addAttachment: function(project) {
                this.option = 5;
                this.project = project;
            },
            //If remove -> Remove (project_users, comments, projects) (In process)
            removeProject: function(projectId) {
                if(confirm('Do you want to remove this project?')) {
                    //Remove a project by projectId
                    // const filter_projects = this.projects_filter.filter(project => {
                    //     return project.id != projectId;
                    // })
                    // this.sample_data = filter_projects; 
                    // this.projects_filter = filter_projects;
                    axios.delete(`${api_baseUrl}api/projects/${projectId}`, {
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        }
                    }).then(response => {
                        const response_body = response.data;
                        alert('You have removed this project successfully!');
                        console.table(response_body);
                    }).catch(e => {
                        const error_response = e.response.data;
                        const error_message = `Error ${error_respone.status} - ${error_response.message}`;
                        alert(error_message);
                    })
                    
                } else {
                    alert('You canceled!')
                }
                console.table(this.projects_filter);
            }
        },
        created() {
            this.getMyProjects();
        }
    }
</script>

<style>
    .item1 {
        background-color: #ffeecc;
    }
    
    .button-item {
        margin: 10px 10px 10px 0;     
    }
</style>