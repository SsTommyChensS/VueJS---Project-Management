<template>
    <h1 class="mb-4">All Projects</h1>
    <h4 class="all-projects-description">
        All Public Projects Or Projects That User Has Been Invited To (Or Owner)
    </h4>
    <div class="all_projects_list">
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
                    <th scope="col">Owner</th>
                    <th scope="col">Start Date</th>
                    <th scope="col">End Date</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(project, index) in projects_filter" :key="project.id">
                    <td >{{ ++index }}</td>
                    <td>{{ project.title }}</td>
                    <td>{{ project.description }}</td>
                    <td>{{ project.owner_name }}</td>
                    <td>{{ project.start_date }}</td>
                    <td>{{ project.closed_date }}</td>
                    <td v-html="displayProjectStatus(project.status)"></td>
                    <td>
                        <button type="button" class="btn btn-info button-item" @click="showCommentsByProject(project.id)"><i class="bi bi-bar-chart-steps"></i> See comments</button>
                        <button type="button" class="btn btn-secondary button-item" @click="commentProject(project)"><i class="bi bi-app-indicator"></i> Comment</button>
                        <button type="button" class="btn btn-danger button-item"><i class="bi bi-arrow-right" @click="joinProjectByCode(project)"></i> Join</button>
                    </td>
                </tr>
            </tbody>     
        </table>
        <LoadingSpinner v-if="isLoading"/>
        <ShowComments :comments="comments_filter" v-if="option == 1"/>
        <JoinProject :project_item="project" v-if="option == 2"/>
        <CommentProject :project_item="project" v-if="option == 3"/>
    </div>
    
</template>

<script>
    import LoadingSpinner from '../items/LoadingSpinner.vue'

    import ShowComments from '../items/ShowComments.vue'
    import CommentProject from '../items/CommentProject.vue'
    import JoinProject from './JoinProject.vue'
    import axios from 'axios'

    const api_baseUrl= import.meta.env.VITE_BE_API;
    
    export default {
        components: {
            LoadingSpinner,
            ShowComments,
            JoinProject,
            CommentProject
        },
        data() {
            return {
                token: this.$store.state.token,
                projects: [],
                projects_filter: [],
                project: {},
                comments_filter: [],
                search_title: '',
                option: 0,
                isLoading: true,
            }
        },
        methods: {
            //Get all projects
            getAllProjects: function() {
                axios.get(api_baseUrl+'api/projects/', {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                }).then(response => {
                    this.isLoading = false;
                    this.projects = response.data.data.projects;
                    this.projects_filter = this.projects;
                }).catch(error => {
                    console.log(error.response);
                })
            },
            displayProjectStatus: function(status) {
                switch (status) {
                    case 1: return '<span class="project__status project__status--new">'+ 'New' +'</span>';
                    case 2: return '<span class="project__status project__status--inprocess">In Process</span>';
                    case 3: return '<span class="project__status project__status--done">Done</span>';
                    case 4: return '<span class="project__status project__status--outofdate">Out of date</span>';
                }
            },
            //Done
            showCommentsByProject: function(projectId) {
                axios.get(`${api_baseUrl}api/projects/${projectId}/list-comments`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                }).then(response => {
                    const response_body = response.data;
                    this.comments_filter = response_body.data.comments;
                    this.option = 1;
                }).catch(e => {
                    console.log(e.response);
                })
            },
            //Get projects by status(Done)
            showProjectsByStatus: function(e) {
                const status = e.target.value;
                if(status == 5) {
                    this.getAllProjects();
                } else {
                    axios.get(`${api_baseUrl}api/projects`, {
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
            //Done
            showProjectsByTitle: function() {
                const search_title = this.search_title.toLowerCase();
                if(search_title  == '') {
                    this.getAllProjects();
                } else {
                    axios.get(`${api_baseUrl}api/projects`, {
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
            //Join project by project's code
            joinProjectByCode(project) {
                this.option = 2;
                this.project = project;
            },
            //Comment at a project
            commentProject(project) {
                this.option = 3;
                this.project = project;
            }
        },
        //Original data API calling
        created() {
            this.getAllProjects();
        }
    }
</script>

<style>
    .button-item {
        margin: 10px 10px 10px 0;     
    }

    .search-bar {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
    }
    .search-bar{
        display: flex;
    }

    .project__status {
        font-weight: bolder;
    }

    .project__status--new {
        color: green;
    }

    .project__status--inprocess {
        color: #999900;
    }

    .project__status--done {
        color: blue;
    }

    .project__status--outofdate {
        color: red;
    }

    .all-projects-description {
        font-style: italic;
        color: #993333;
    }
</style>