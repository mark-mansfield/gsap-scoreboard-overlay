import React, { PureComponent } from 'react';
import { TimelineLite } from 'gsap/all';

class ScoreBoard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isAnimating: false,
      minutes: 90,
      seconds: 0
    };
    this.scoreboardRef = null;
    this.scoreboardRef_homeTeam = null;
    this.homeTeamTextRef = null;
    this.awayTeamTextRef = null;
    this.scoreboardRef_scores = null;
    this.scoreboardRef_awayTeam = null;
    this.scoreTextRef = null;
    this.clockRef = null;
    this.teamStatRef = null;
    this.teamStatLeftColRef = null;
    this.teamStatRightColRef = null;
    this.scoreboardTimeline = new TimelineLite({ paused: true });
    this.clockTimeLine = new TimelineLite({ paused: true });
    this.teamStatTimeline = new TimelineLite({ paused: true });
  }

  componentDidMount() {
    // countdown timer

    this.myInterval = setInterval(() => {
      const { seconds, minutes } = this.state;
      if (seconds > 0) {
        this.setState(({ seconds }) => ({
          seconds: seconds - 1
        }));
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(this.myInterval);
        } else {
          this.setState(({ minutes }) => ({
            minutes: minutes - 1,
            seconds: 59
          }));
        }
      }
    }, 1000);

    console.log('default animation', this.props.animation);
    // card width 80px relates directly to a css variable --card-width style.css
    const cardWidth = 80;

    // score board timeline
    this.scoreboardTimeline

      .from(this.scoreboardRef_scores, 0.5, {
        scaleX: 0,
        autoAlpha: 0,
        onStart: () => {
          console.log('starting animation');
          this.setState({ isAnimating: true });
        }
      })
      .from(this.scoreTextRef, 0.3, { autoAlpha: 0, scale: 2 })
      .from(this.scoreboardRef_homeTeam, 0.3, { autoAlpha: 0 })
      .to(this.scoreboardRef_homeTeam, 0.3, { left: 0 })
      .from(this.homeTeamTextRef, 0.3, { autoAlpha: 0, x: 20 })
      .from(this.scoreboardRef_awayTeam, 0.3, { autoAlpha: 0 }, '-=0.9')
      .to(this.scoreboardRef_awayTeam, 0.3, { left: cardWidth * 2 + 10 })
      .from(this.awayTeamTextRef, 0.3, {
        autoAlpha: 0,
        x: -20,
        onComplete: () => {
          this.setState({ isAnimating: false });
          if (this.props.animation.length !== 2) {
            this.clockTimeLine.play();
          }
        }
      });

    //  clock timeline
    this.clockTimeLine
      .from(this.clockRef, 0.5, {
        autoAlpha: 0,
        onStart: () => {
          this.setState({ isAnimating: true });
        }
      })
      .to(
        this.clockRef,
        1,
        {
          left: cardWidth * 3 + 9,
          onComplete: () => {
            this.setState({ isAnimating: false });
          }
        },
        '-=0.5'
      );

    // team stats time line
    this.teamStatTimeline
      .from(this.teamStatRef, 1, {
        autoAlpha: 0,
        onStart: () => {
          this.setState({ isAnimating: true });
        }
      })
      .to(this.teamStatRef, 1, { x: cardWidth * 3.1 }, '-=0.5')
      .to(this.teamStatRightColRef, 1, {
        x: cardWidth * 3 - 15,
        onComplete: () => {
          this.setState({ isAnimating: false });
        }
      });
  }

  // compare props
  componentDidUpdate(prevProps, prevState) {
    console.log(prevState.isAnimating);
    console.log(this.state.isAnimating);

    // we attempt to pause if we are animating
    if (this.state.isAnimating) {
      console.log('PAUSING *******************');
      setTimeout(() => {
        console.log('PAUSING COMPLETE');
      }, 1500);
    }

    //   prev and current Props

    // play the scoreboard animation 0 : 1
    if (!this.state.isAnimating) {
      if (prevProps.animation.length === 0 && this.props.animation.length === 1) {
        this.scoreboardTimeline.delay(this.props.animation[0].delay);
        this.scoreboardTimeline.play();

        console.log('play the scoreboard animation');
      }

      // reverse the clock animation
      // play the team stat animation  1 : 2
      if (this.props.animation.length === 2) {
        this.clockTimeLine.reverse();
        // this.teamStatTimeline.delay(this.props.animation[0].delay);
        this.teamStatTimeline.play().delay(this.props.animation[0].delay);
      }

      // reverse the team Stat and play the clock animation
      if (prevProps.animation.length === 2 && this.props.animation.length === 1) {
        this.teamStatTimeline.reverse(1.5);
        this.clockTimeLine.play().delay(1);
      }

      // reverse the scoreboard animation hide scoreboard
      if (prevProps.animation.length === 1 && this.props.animation.length === 0) {
        this.clockTimeLine.reverse(0.3);
        this.scoreboardTimeline.reverse(1).delay(1);
      }

      // when the teamstat component is in full view and the scoreboard is toggled out
      // reverse all animations
      if (prevProps.animation.length === 2 && this.props.animation.length === 0) {
        this.setState({ isAnimating: true });
        this.teamStatTimeline.reverse();
        this.clockTimeLine.reverse().delay(1);
        this.scoreboardTimeline.reverse().delay(2.5);
        setTimeout(() => {
          this.setState({ isAnimating: false });
        }, 2500);
      }
    }
  }

  render() {
    const { minutes, seconds } = this.state;
    return (
      <div className="overlay-bg">
        <div>
          <div className="scoreboard">
            <div className="d-flex" ref={div => (this.scoreboardRef = div)}>
              <div
                // effect slide left
                className="hometeam custom-card"
                ref={div => (this.scoreboardRef_homeTeam = div)}
                style={{
                  backgroundColor: this.props.homeTeamColor,
                  textAlign: 'center'
                }}>
                <span ref={e => (this.homeTeamTextRef = e)}>GG</span>
              </div>

              <div
                className="scores custom-card"
                // effect fade in and scaleX
                ref={div => (this.scoreboardRef_scores = div)}
                style={{
                  textAlign: 'center'
                }}>
                <span ref={e => (this.scoreTextRef = e)}>2:0</span>
              </div>

              <div
                className="awayteam custom-card"
                // effect slide right
                ref={div => (this.scoreboardRef_awayTeam = div)}
                style={{
                  backgroundColor: this.props.awayTeamColor,
                  textAlign: 'center'
                }}>
                <span ref={e => (this.awayTeamTextRef = e)}>MU</span>
              </div>
              <div ref={div => (this.clockRef = div)} className="clock custom-card">
                {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
              </div>
              <div className="teamstat" ref={div => (this.teamStatRef = div)}>
                <div
                  ref={div => (this.teamStatLeftColRef = div)}
                  className="team-stat-left-col"
                  style={{
                    backgroundColor: this.props.homeTeamColor
                  }}>
                  <div className="team-logo">
                    <i className="fa fa-shield "></i>
                  </div>
                  <div className="team-name">Kingston City</div>
                </div>

                <div ref={div => (this.teamStatRightColRef = div)} className="team-stat-right-col team-red-cards">
                  <div>Red Cards</div>
                  <div>
                    <span className="large-text">0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ScoreBoard;
