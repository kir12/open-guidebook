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
			filterData:[],
			tagLoaded : false,
			loaded: false,
			placeholder: "Loading",
			eventActive:false,
			filterBarActive:false
		};
		//various callbacks registered here
		this.changeActive = this.changeActive.bind(this);
		this.changeActivePost = this.changeActivePost.bind(this);
		this.filterCallback = this.filterCallback.bind(this);
		this.addFilterQuery = this.addFilterQuery.bind(this);
		this.filterSearch= this.filterSearch.bind(this);
	}

	//callback executed when a panel is selected
	changeActive(evt){
		this.setState({eventActive:!this.state.eventActive,
			eventObj:evt,
			scrollAmount: window.pageYOffset
		},()=>{
			var showStatus = this.state.eventActive == true ? 'show' : 'hide';
			var eventElement = (
				<div className = {'eventPanel ' + showStatus}>
					<h3 className = "mt-5">{evt.title}</h3>

					<div>
						<p className = "mb-0">{App.displayTime(evt.start_time)} - {App.displayTime(evt.end_time)}, {evt.location}</p>
						<p className="small tagline">{evt.tags.map(tg=>{return <span key = {tg.tag} className = "tagStyle" style ={{backgroundColor:colormap[tg.tag]}}>{tg.tag_screen}</span>})}</p>
					</div>

					{this.state.eventObj.guest_speakers != "" &&
						<div>
							{App.genEventHeader("Special Guest Speaker(s):")}
							<p>{this.state.eventObj.guest_speakers}</p>
						</div>
					}
					{this.state.eventObj.remark != "" &&
						<div>
							{App.genEventHeader("Remark about this Panel:")}
							<p>{this.state.eventObj.remark}</p>
						</div>
					}
					{App.genEventHeader("Description:")}
					<p>{evt.description}</p>
				</div>
			);
			ReactDOM.render(eventElement,eventContainer);
		});
	}

	//callback executed when panel is de-selected
	//optional parameter filterActive to show bar
	changeActivePost(e, filterActive = false){
		e.preventDefault();
		this.setState({eventActive:!this.state.eventActive,
			filterData:[],
		},()=>{
			var showStatus = this.state.eventActive == true ? 'show' : 'hide';
			var eventElement = (
				<div className = {'eventPanel ' + showStatus}></div>
			);
			ReactDOM.render(eventElement,eventContainer);
			window.scrollTo(0,this.state.scrollAmount);
		});
	}

	//callback issued to generate filter menu
	filterCallback(e){
		e.preventDefault();
		this.setState({eventActive:!this.state.eventActive,
			scrollAmount: window.pageYOffset
		},()=>{
			var showStatus = this.state.eventActive == true ? 'show' : 'hide';
			var eventElement = (
				<div className = {'eventPanel ' + showStatus}>
					<h3 className = "mt-5">Event Filter</h3>
					<p>Feel free to select whatever event types you want, and see if any events come up.</p>
					{this.state.tagData.map(tg=>{
						return(
							<FilterObject tg = {tg} addFilterQuery = {this.addFilterQuery}/>
						);
					})}
					<h5 className = "text-center filterButton" onClick={(e)=>{this.filterSearch(e)}}>Show Results</h5>
				</div>
			);
			ReactDOM.render(eventElement,eventContainer);
		});
	}

	//callback to feed filter query back to mother app
	addFilterQuery(tag, isChecked){
		if(isChecked){
			this.state.filterData.push(tag);
		}
		else{
			var index = this.state.filterData.indexOf(tag);
			this.state.filterData.splice(index,1);
		}
	}

	//do the actual search for results, render with results, save old data, floop!
	filterSearch(e){
		var searchResults = this.state.data.filter(evt => {
			for (var tag of evt.tags){
				for (var filterTag of this.state.filterData){
					if(tag.tag == filterTag.tag){return true;}
				}
			}
			return false;
		});
		this.setState({oldData:this.state.data, 
			data:searchResults,
			filterBarActive:true
		},()=>{
			console.log(this.state.data);
			this.changeActivePost(e);
		});
	}

	//api call(s)
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

		fetch("api/eventTags")
			.then(response=>{
				if(response.status > 400){
					return this.setState(() => {
						return { placeholder: "Something went wrong!" };
					});
				}
				return response.json();
			})
		.then(tagData => {
			this.setState(()=>{
				return{
					tagData,
					tagLoaded:true
				};
			});
		});
	}

	//primary rendering of events
	render() {
		return (
			<div>
				<StickyMenu handler={this.changeActivePost} filterCallback = {this.filterCallback} eventState={this.state.eventActive} filterBarActive={this.state.filterBarActive}/>
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
		return datevar.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit',timeZone:'America/Detroit'});
	}
	
	static genEventHeader(header){
		return (<p className = "text-center small eventHeader">{header}</p>);
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
					<li className="nav-item" onClick = {(e)=>{props.filterCallback(e)}}>
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
					<li className = "nav-item" onClick={(e)=>{props.handler(e)}}>
						<a className="nav-link" href = "#"><i className="fas fa-arrow-left"></i></a>
					</li>
				</ul>
				<ul className="navbar-nav">
					<li className="nav-item" href="#">
						<a className="nav-link" href = "#"><i className="far fa-bookmark"></i></a>
					</li>
				</ul>
			</div>
		);
	}
	return(
		<div className = "sticky-top">
			<nav className="navbar navbar-light bg-light navbar-expand ">
				{props.eventState ==false &&
						<a className="navbar-brand" href="#">Schedule</a>}

				{/*options, might wanna add hamburger collapse back if desired*/}
				{element}
			</nav>
			<div>
				{props.filterBarActive == true && props.eventState == false &&
					<div className = "row small eventHeader" style={{marginRight:'0'}}>
						<div className = "col-6">
							<p className = "pl-3 mb-0">Filter Events Active</p>
						</div>
						<div className = "col-6 text-right">
							<p className = "mb-0 pr-3"><i className="fas fa-times-circle"></i> Reset Filters</p>
						</div>
					</div>
				}
			</div>
		</div>
	);
}

class FilterObject extends Component{
	constructor(props){
		super(props);
		this.state={isChecked:false};
		this.checkClick = this.checkClick.bind(this);
	}

	render(){
		return (
			<div className = "row">
				<div className = "col-11">
					<p className = "small tagline tagStyle" style = {{backgroundColor:colormap[this.props.tg.tag]}}> {this.props.tg.tag_screen} </p>
				</div>
				<div className = "col-xs-auto" onClick ={this.checkClick}>
					<i className={'far fa'+(this.state.isChecked ? '-check':'')+'-square'}></i>
				</div>
			</div>
		);
	}

	checkClick(){
		this.setState({isChecked:!this.state.isChecked},()=>{
			this.props.addFilterQuery(this.props.tg, this.state.isChecked);
		});
	}
}

//each event is embedded inside its own class to handle events (and to store descriptions)
class EventClass extends Component{
	constructor(props){
		super(props);
		//this.clickEvent = this.clickEvent.bind(this);
	}
	render(){
		return(
			<li onClick = {()=>{this.props.handler(this.props.eventObj)}} className = "list-group-item" key = {this.props.eventObj.title}>
				<div className = "row">
					<div className = "col-11">
						<p><b>{this.props.eventObj.title}</b></p>
						<div>
							<p className = "mb-0">{App.displayTime(this.props.eventObj.start_time)} - {App.displayTime(this.props.eventObj.end_time)}, {this.props.eventObj.location}</p>
							<p className="small tagline">{this.props.eventObj.tags.map(tg=>{return <span key = {tg.tag} className = "tagStyle" style ={{backgroundColor:colormap[tg.tag]}}>{tg.tag_screen}</span>})}</p>
						</div>
					</div>
					<div className = "col-xs-auto align-self-center">
						<i className="far fa-bookmark"></i>
					</div>
				</div>
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
