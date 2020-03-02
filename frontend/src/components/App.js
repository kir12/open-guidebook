import ReactDOM from 'react-dom';
import React, { Component } from "react";
import { render } from "react-dom";

var colormap = {
	"fanpanel":"#0039A6",
	"guestpanel":"#FF6319",
	"performance":"#6CBE45",
	"screening": "#996633",
	"cosplay":"#A7A9AC",
	"18+":"#EE352E",
	"gaming":"#00933C",
	"autographs":"#B933AD"
}


//processes the actual retrieval of events
class App extends Component{
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			loaded: false,
			placeholder: "Loading",
			eventActive:false
		};
		//keeps track of if event page is active
		this.changeActive = this.changeActive.bind(this);
		this.changeActivePost = this.changeActivePost.bind(this);
	}

	changeActive(evt,details){
		this.setState({eventActive:!this.state.eventActive,
			eventObj:evt,
			detailsXML:details
		},()=>{
			var showStatus = this.state.eventActive == true ? 'show' : 'hide';
			var eventElement = (
				<div className = {'eventPanel ' + showStatus}>
					<h3 className = "mt-5">{evt.title}</h3>
					{details}
					<p>{evt.description}</p>
				</div>
			);
			ReactDOM.render(eventElement,eventContainer);
		});
	}

	changeActivePost(){
		this.setState({eventActive:!this.state.eventActive},()=>{
			var showStatus = this.state.eventActive == true ? 'show' : 'hide';
			var eventElement = (
				<div className = {'eventPanel ' + showStatus}>
					<h3 className = "mt-5">{this.state.eventObj.title}</h3>
					{this.state.details}
					<p>{this.state.eventObj.description}</p>
				</div>
			);
			ReactDOM.render(eventElement,eventContainer);

		});
	}

	componentDidMount() {
		fetch("api/events")
			.then(response => {
				if (response.status > 400) {
					return this.setState(() => {
						return { placeholder: "Something went wrong!" };
					});
				}
				return response.json();
			})
		.then(data => {
			this.setState(() => {
				return {
					data,
					loaded: true
				};
			});
		});
	}

	render() {
		return (
			<div>
				<StickyMenu handler={this.changeActivePost} eventState={this.state.eventActive}/>
				<ul className = "list-group list-group-flush">
					{this.state.data.map(evt => {
						return (
							<EventClass eventObj = {evt} handler={this.changeActive} eventState = {this.state.eventActive}/>
						);
					})}
				</ul>
			</div>
		);
	}
	static displayTime(t){
		var datevar = new Date(t);
		return datevar.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
	}

	genColor(tag){
		return "background-color: " + colormap[tag];
	}
}

//generalized stickymenu
function StickyMenu(props){
	if(props.eventState == false){//event is not active
		var element = (
			<div className = "navbar-collapse collapse">
				<ul className="navbar-nav">
					<li className="nav-item">
						<a className="nav-link" href="#"><i className="fas fa-filter"></i></a>
					</li>
					<li className="nav-item">
						<a className = "nav-link" href = "#"><i className="fas fa-search"></i></a>
					</li>
				</ul>
			</div>
		);
	}
	else{//event is active
		var element = (
			<div className = "navbar-collapse collapse">
				<ul className="navbar-nav mr-auto">
					<li className = "nav-item" onClick={props.handler}>
						<a className="nav-link" href = "#"><i className="fas fa-arrow-left"></i></a>
					</li>
				</ul>
				<ul className="navbar-nav">
					<li className="nav-item" href="#">
						<a className="nav-link" href = "#"><i className="fas fa-bookmark"></i></a>
					</li>
				</ul>
			</div>
		);
	}
	return(
		<nav className="navbar sticky-top navbar-light bg-light navbar-expand ">
			{props.eventState ==false &&
					<a className="navbar-brand" href="#">Schedule</a>}

			{/*options, might wanna add hamburger collapse back if desired*/}
			{element}
		</nav>
	);
}

//each event is embedded inside its own class to handle events (and to store descriptions)
class EventClass extends Component{
	constructor(props){
		super(props);
		//this.clickEvent = this.clickEvent.bind(this);
		this.details = (
			<div>
				<p>{App.displayTime(this.props.eventObj.start_time)} - {App.displayTime(this.props.eventObj.end_time)}, {this.props.eventObj.location}</p>
				<p className="small tagline">{this.props.eventObj.tags.map(tg=>{return <span key = {tg.tag} className = "tagStyle" style ={{backgroundColor:colormap[tg.tag]}}>{tg.tag_screen}</span>})}</p>
			</div>
		);
	}
	render(){
		return(
			<li onClick = {()=>{this.props.handler(this.props.eventObj, this.details)}} className = "list-group-item" key = {this.props.eventObj.title}>
				<p><b>{this.props.eventObj.title}</b></p>
				{this.details}
			</li>
		);
	}
}

export default App;
const eventContainer = document.getElementById("eventCanvas");
const container = document.getElementById("app");
render(<App />, container);
render((
	<div className = "eventPanel hide"></div>
),eventContainer);
