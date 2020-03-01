import React, { Component } from "react";
import { render } from "react-dom";

//processes the actual retrieval of events
class App extends Component{
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			loaded: false,
			placeholder: "Loading"
		};
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
			<ul className = "list-group list-group-flush">
				{this.state.data.map(evt => {
					return (
						<li className = "list-group-item" key = {evt.title}>
							<p><b>{evt.title}</b></p>
							<p>{this.displayTime(evt.start_time)} - {this.displayTime(evt.end_time)}, {evt.location}</p>
							<p className="small tagline">{evt.tags.map(tg=>{return <span key = {tg.tag} className = "tagStyle" style ={{backgroundColor:colormap[tg.tag]}}>{tg.tag_screen}</span>})}</p>
						</li>
					);
				})}
			</ul>
		);
	}

	displayTime(t){
		var datevar = new Date(t);
		return datevar.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
		//return datevar.getHours() + ":" + datevar.getMinutes();
	}

	genColor(tag){
		return "background-color: " + colormap[tag];
	}
}

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

export default App;
const container = document.getElementById("app");
render(<App />, container);
