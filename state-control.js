import React, { Component } from "react";
import { TimelineLite, CSSPlugin } from "gsap/all";

class StateControl extends Component {

	constructor(props){
		super(props);

		this.state = {
			play: false,
			pause: true,
			reverse: false,
			restart: false,
      delay: 0
		};

		this.logoContainer = null;
		this.logoTween = new TimelineLite({ paused: true });

		this.buttonClickHandler = this.buttonClickHandler.bind(this);
	}

	/** The button click handler
	 * Depending on the type of action, how the state will be updated
	 * @param {string} type the action for the timeline
	*/
	buttonClickHandler = type => {
		const newState = {};
		newState[type] = true;
		this.setState( newState );
	}

  updateDelay = () => {
    const newState = {
      	play: false,
			pause: true,
			reverse: false,
			restart: false,
      delay: 3.0
    }
    	this.setState( newState );
  }

	componentDidMount(){
		// create logo tween
		this.logoTween
			.to(this.logoContainer, 2, {delay: this.state.delay, x: 500 })
			.to(this.logoContainer, 1, { rotation: 360, transformOrigin: "center" });
	}

	// after the component's state has changed, update the 
	// timeline control. We compare the previous and updated state
	componentDidUpdate(prevProps, prevState) {
		const {
			play: prePlay,
			pause: prePause,
			reverse: preReverse,
			restart: preRestart,
      delay: prevDelay
		} = prevState;
		const { play, pause, reverse, restart, delay } = this.state;

// the delay state has changed
    	if ( delay && delay !== prevDelay ) {
      this.logoTween.delay(delay)
			this.logoTween.play();
			}


		// the play state has changed
		if ( play && play !== prePlay ) {
			this.logoTween.play();
			// play means that the paused and reversed state should be false
			this.setState({
				pause: false,
				reverse: false
			});
		}
		// the pause state has changed
		if ( pause && pause !== prePause ) {
			this.logoTween.pause();
			// pausing means that play and reverse states should be false
			this.setState({
				play: false,
				reverse: false
			});
		}
		// the reversed state has changed 
		if ( reverse && reverse !== preReverse ) {
			this.logoTween.reverse();
			// the pause and play state should be false
			this.setState({
				play: false,
				pause: false
			});
		}
		// the restart state has changed
		if ( restart && restart !== preRestart ) {
			this.logoTween.restart();
			// the play state should be true
			// pause and reverse should be false
			// finally reset restart
			this.setState({
				play: true,
				pause: false,
				reverse: false,
				restart: false
			});
		}
	}

	render(){
		return <div className="container">
			<div className="row">
				
				<div className="col-12 mt-3">
					<h3 className="text-center">custom controls</h3>
						<button
							className="btn gsap-btn"
							onClick={this.updateDelay.bind()}
						>Update delay</button>
					<hr />
				</div>

				<div className="col-12 col-md-6">
					<h3 className="text-center">Control Logo Tween</h3>
					<p>Use the buttons to control the Logo Tween</p>
					<div className="mb-2 btn-group">
						<button
							className="btn gsap-btn"
							onClick={this.buttonClickHandler.bind(null, "play")}
						>Play</button>
						<button
							className="btn gsap-btn"
							onClick={this.buttonClickHandler.bind(null, "pause")}
						>Pause</button>
						<button
							className="btn gsap-btn"
							onClick={this.buttonClickHandler.bind(null, "reverse")}
						>Reverse</button>
						<button
							className="btn gsap-btn"
							onClick={this.buttonClickHandler.bind(null, "restart")}
						>Restart</button>
            
					</div>
				</div>
				
				<div className="col-12 col-md-6">
					<h4 className="text-center">App State</h4>
					<pre className="p-2">
						{ JSON.stringify(this.state, null, 2) }
					</pre>
				</div>

				<div className="col-12 mt-3">
					<hr/>
					<img
						src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/16327/logo-man.svg"
						alt="GSAP Logo"
						className="img-fluid logo"
						ref={img => this.logoContainer = img}
					/>
				</div>

			</div>
		</div>;
	}
	
}

export default StateControl;
