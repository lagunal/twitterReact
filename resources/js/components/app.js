import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            body: '',
            posts: [],
            loading: false,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.renderPosts = this.renderPosts.bind(this);
    }

    getPosts() {
        this.setState({ loading: true });
        axios.get('/posts')
            .then((response) => this.setState({ 
                posts: [...response.data.posts],
                loading: false
            }));

    }

    componentWillMount() {
        this.getPosts();
    }

    componentDidMount() {
        this.interval = setInterval(()=>this.getPosts(), 30000);
        // Echo.private('new-post').listen('PostCreated', (e) => {
        //     console.log('from pusher ' , e.post);
        //     this.setState({ posts: [e.post, ...this.state.posts] })
        // })

    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    handleSubmit(e) {
        e.preventDefault();
        //this.handleSave();
        axios.post('/posts' , {
            body: this.state.body
        })
        .then(response => {
            //console.log('from handle submit', response);
            this.setState({
                posts: [response.data, ...this.state.posts]
            });
        });
        this.setState({
            body: ''
        });
        
    }

    handleChange(e) {
        this.setState({
            body: e.target.value,
        })
    }

    renderPosts() {
        return(
            this.state.posts.map(post => 
            <div className="media" key={post.id}>
                <img className="mr-2" src={post.user.avatar} />
                <div className="media-body mt-0">
                    <a href={`/users/${post.user.username}`}><b>{post.user.username}</b></a>
                        {' '} - {post.humanCreatedAt}
                    <p>{post.body}</p>
                </div>
            </div>)
        );    
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">Tweet Something...</div>

                            <div className="card-body">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <textarea className="form-control" rows='5' maxLength='140' 
                                                  placeholder="What's up" required
                                                  onChange={this.handleChange} 
                                                  value={this.state.body} />
                                    </div>
                                    <input type="submit" value="Post" className="form-control"/>
                                </form>
                            </div>
                        </div>
                    </div>
                    {this.state.posts.length > 0 &&
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-header">Recents Tweets</div>

                                <div className="card-body">
                                    {!this.state.loading ? this.renderPosts() : 'Loading...'}
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default App;

