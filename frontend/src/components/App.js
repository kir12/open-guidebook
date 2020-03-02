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
	}

	changeActive(){
		this.setState({eventActive:!this.state.changeActive});
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
				<StickyMenu eventState={this.state.eventActive}/>
				<ul className = "list-group list-group-flush">
					{this.state.data.map(evt => {
						return (
							<EventClass {...evt} handler={this.changeActive} />
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
					<li className = "nav-item">
						<a className="nav-link" href = "#"><i className="fas fa-backward"></i></a>
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
				{props.elementState ==false &&
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
		this.clickEvent = this.clickEvent.bind(this);
		this.details = (
			<div>
				<p>{App.displayTime(this.props.start_time)} - {App.displayTime(this.props.end_time)}, {this.props.location}</p>
				<p className="small tagline">{this.props.tags.map(tg=>{return <span key = {tg.tag} className = "tagStyle" style ={{backgroundColor:colormap[tg.tag]}}>{tg.tag_screen}</span>})}</p>
			</div>
		);
	}
	render(){
		return(
			<li onClick = {this.clickEvent} className = "list-group-item" key = {this.props.title}>
				<p><b>{this.props.title}</b></p>
				{this.details}
			</li>
		);
	}

	clickEvent(){
		console.log("click");
		this.props.handler();
		var eventElement = (
			<div className = "eventPanel show">
				<h3 className = "mt-5">{this.props.title}</h3>
				{this.details}
				<p>{this.props.description}</p>
			</div>
		);
		ReactDOM.render(eventElement,eventContainer);
	}


}

export default App;
const eventContainer = document.getElementById("eventCanvas");
const container = document.getElementById("app");
render(<App />, container);
render((
	<div className = "eventPanel hide"></div>
),eventContainer);
